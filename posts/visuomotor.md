# Vision-based robot control
Authors: Jane Lee
Date: 2025-12-25
Image: media/thumbnails/solder_zoom.mp4
Description: Visual servoing closes the wrist-camera loop in under 60 ms with robust grasp scoring.

We refined our visual servoing stack to close the loop between a wrist camera and gripper motion in under **60 ms**. The model blends classical pose estimation with lightweight CNN features for robust grasp point detection under glare.

- Calibrated camera frames with an AprilTag board and automated offsets.
- Added an uncertainty-aware scorer to reject unstable grasps.
- Deployed the pipeline on a Jetson Orin for low-latency execution.

Next up: pairing this with tactile feedback to adapt grasps when packages flex in transit.
