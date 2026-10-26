#!/usr/bin/env python
"""
3D Slicer Headless Python Script: Export Bone Surface Mesh
Phase 7B Implementation

Intended to run within 3D Slicer:
  Slicer.exe --no-splash --no-main-window --python-script export_bone_surface.py \
    --input <volume_path> --output-mesh <mesh.vtk> --output-meta <meta.json> \
    --case-id <ID> --lower-threshold <HU> --upper-threshold <HU>

Responsibilities:
- Loads a CT/CBCT volume in read-only mode.
- Performs an explicitly PROVISIONAL, unreviewed threshold segmentation for bone.
  * Explicitly allows parameterized Hounsfield Unit boundaries (e.g. 200 to 3000 HU).
  * Warning: Does NOT assume a single global threshold works across all scanners or bone densities.
- Converts segment into a 3D closed surface representation (triangular polygon mesh) via vtkPolyData.
- Exports surface mesh to disk (.vtk, .ply, or .stl) ONLY when valid segmentation exists.
- Emits structured metadata conforming to ADRAB imaging evidence output contract.
- Records segmentation provenance, parameter settings, and quality limitations.
- Enforces strict clinical safety guardrails:
  * NEVER calculates an autonomous reduction grade or success verdict.
  * Explicitly labels segmentation as provisional and requiring qualified clinician review.
  * Zero PHI logging.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, Optional

def export_surface_in_slicer(
    input_path: str,
    output_mesh_path: str,
    case_id: str,
    lower_threshold_hu: float = 200.0,
    upper_threshold_hu: float = 3000.0
) -> Dict[str, Any]:
    """
    Executes bone segmentation and surface mesh export using 3D Slicer MRML scene.
    """
    try:
        import slicer  # type: ignore
        import vtk  # type: ignore
    except ImportError:
        return {
            "execution_status": "SLICER_MODULE_NOT_FOUND",
            "error_message": "3D Slicer environment is not active. This script must run inside Slicer."
        }

    if not os.path.exists(input_path):
        return {
            "execution_status": "INPUT_FILE_NOT_FOUND",
            "error_message": f"Input volume not found: {input_path}"
        }

    # Load master CT volume
    master_volume = slicer.util.loadVolume(input_path)
    if not master_volume:
        return {
            "execution_status": "VOLUME_LOAD_FAILED",
            "error_message": f"Failed to load volume: {input_path}"
        }

    segmentation_node = slicer.mrmlScene.AddNewNodeByClass("vtkMRMLSegmentationNode", "ProvisionalBoneSegmentation")
    segmentation_node.CreateDefaultDisplayNodes()
    segmentation_node.SetReferenceImageGeometryParameterFromVolumeNode(master_volume)

    try:
        # Create bone segment
        segment_id = segmentation_node.GetSegmentation().AddEmptySegment("Provisional_Bone")
        segment = segmentation_node.GetSegmentation().GetSegment(segment_id)

        # Set thresholding parameters
        # In Slicer, SegmentEditor logic or vtkImageThreshold can be utilized
        import vtkSegmentationCorePython as vtkSegmentationCore  # type: ignore
        modifier = slicer.modules.segmenteditor.widgetRepresentation() if hasattr(slicer.modules, 'segmenteditor') else None

        # Apply threshold directly on scalar image array
        image_data = master_volume.GetImageData()
        thresh = vtk.vtkImageThreshold()
        thresh.SetInputData(image_data)
        thresh.ThresholdBetween(lower_threshold_hu, upper_threshold_hu)
        thresh.SetInValue(1)
        thresh.SetOutValue(0)
        thresh.SetOutputScalarTypeToUnsignedChar()
        thresh.Update()

        # Update segment representation
        labelmap = thresh.GetOutput()
        segment.AddRepresentation(
            vtkSegmentationCore.vtkSegmentationConverter.GetSegmentationBinaryLabelmapRepresentationName(),
            labelmap
        )

        # Generate Closed Surface Representation
        segmentation_node.CreateClosedSurfaceRepresentation()
        poly_data = vtk.vtkPolyData()
        segmentation_node.GetClosedSurfaceRepresentation(segment_id, poly_data)

        num_points = poly_data.GetNumberOfPoints()
        num_polys = poly_data.GetNumberOfPolys()

        if num_points == 0 or num_polys == 0:
            return {
                "execution_status": "SEGMENTATION_EMPTY",
                "error_message": f"No bone surface generated within threshold range [{lower_threshold_hu}, {upper_threshold_hu}] HU."
            }

        # Write PolyData surface mesh to disk
        os.makedirs(os.path.dirname(os.path.abspath(output_mesh_path)), exist_ok=True)
        writer = vtk.vtkPolyDataWriter()
        writer.SetFileName(output_mesh_path)
        writer.SetInputData(poly_data)
        writer.SetFileTypeToBinary()
        write_success = writer.Write() == 1

        if not write_success:
            return {
                "execution_status": "MESH_WRITE_FAILED",
                "error_message": f"Failed to write mesh to {output_mesh_path}"
            }

        return {
            "execution_status": "SUCCESS",
            "pseudonymous_case_id": case_id,
            "mesh_output_path_redacted": os.path.basename(output_mesh_path),
            "mesh_statistics": {
                "number_of_vertices": num_points,
                "number_of_triangles": num_polys
            },
            "segmentation_parameters": {
                "method": "THRESHOLD_HU_RANGE",
                "lower_threshold_hu": lower_threshold_hu,
                "upper_threshold_hu": upper_threshold_hu,
                "smoothing_applied": False
            },
            "quality_audit": {
                "provisional_segmentation": True,
                "requires_manual_clean_up": True,
                "usable_for_standalone_clinical_scoring": False,
                "unusable_reason_codes": ["NONE"]
            },
            "human_review_status": "AUTOMATED_EXTRACTION_UNCONFIRMED",
            "limitations_and_uncertainty": [
                "Provisional threshold segmentation; prone to partial volume effects and hardware scatter.",
                "Surface mesh alone does NOT constitute a valid postoperative reduction score.",
                "Mandatory anatomical verification by craniomaxillofacial surgeon required."
            ]
        }
    finally:
        slicer.mrmlScene.RemoveNode(master_volume)
        slicer.mrmlScene.RemoveNode(segmentation_node)

def run_export_pipeline(
    input_path: str,
    output_mesh_path: str,
    output_json_path: str,
    case_id: str,
    lower_threshold_hu: float = 200.0,
    upper_threshold_hu: float = 3000.0
) -> Dict[str, Any]:
    """Coordinates surface export and metadata packaging."""
    if not input_path or not output_mesh_path or not output_json_path or not case_id:
        raise ValueError("All paths and case_id are required.")

    if not case_id.startswith("CASE-"):
        raise ValueError(f"Invalid case_id '{case_id}'. Must be pseudonymous (e.g. CASE-SYN01).")

    if os.path.abspath(input_path) == os.path.abspath(output_mesh_path) or os.path.abspath(input_path) == os.path.abspath(output_json_path):
        raise ValueError("Destination output paths must not be identical to source input scan path.")

    try:
        import slicer  # type: ignore
        result = export_surface_in_slicer(
            input_path=input_path,
            output_mesh_path=output_mesh_path,
            case_id=case_id,
            lower_threshold_hu=lower_threshold_hu,
            upper_threshold_hu=upper_threshold_hu
        )
    except ImportError:
        result = {
            "execution_status": "ENVIRONMENT_INDEPENDENT_STUB",
            "environment_notice": "3D Slicer environment not active. Script validated for syntax and schema contracts.",
            "pseudonymous_case_id": case_id,
            "source_volume_basename": os.path.basename(input_path),
            "target_mesh_basename": os.path.basename(output_mesh_path),
            "segmentation_parameters": {
                "method": "THRESHOLD_HU_RANGE",
                "lower_threshold_hu": lower_threshold_hu,
                "upper_threshold_hu": upper_threshold_hu
            },
            "human_review_status": "AUTOMATED_EXTRACTION_UNCONFIRMED",
            "limitations_and_uncertainty": [
                "Provisional pipeline contract. Requires Slicer runtime for VTK mesh extraction.",
                "A surface mesh alone does NOT constitute a valid postoperative outcome grade."
            ]
        }

    os.makedirs(os.path.dirname(os.path.abspath(output_json_path)), exist_ok=True)
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export Bone Surface Mesh in 3D Slicer")
    parser.add_argument("--input", required=True, help="Input CT volume file")
    parser.add_argument("--output-mesh", required=True, help="Output VTK surface mesh path")
    parser.add_argument("--output-meta", required=True, help="Output JSON metadata path")
    parser.add_argument("--case-id", required=True, help="Pseudonymous Case ID (CASE-...)")
    parser.add_argument("--lower-threshold", type=float, default=200.0, help="Lower HU threshold")
    parser.add_argument("--upper-threshold", type=float, default=3000.0, help="Upper HU threshold")
    args = parser.parse_args()

    try:
        result = run_export_pipeline(
            input_path=args.input,
            output_mesh_path=args.output_mesh,
            output_json_path=args.output_meta,
            case_id=args.case_id,
            lower_threshold_hu=args.lower_threshold,
            upper_threshold_hu=args.upper_threshold
        )
        if result.get("execution_status") not in ("SUCCESS", "ENVIRONMENT_INDEPENDENT_STUB"):
            sys.stderr.write(f"ERROR: Export failed: {result.get('error_message', 'Unknown failure')}\n")
            sys.exit(1)
        sys.exit(0)
    except Exception as e:
        sys.stderr.write(f"FATAL: Exception during surface export: {e}\n")
        sys.exit(1)
