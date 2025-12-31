# Vision-aligned cobot grasping
Authors: Jane Lee
Date: 2024-07-05
Image: https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80

We refined our visual servoing stack to close the loop between a wrist camera and gripper motion in under **60 ms**. The model blends classical pose estimation with lightweight CNN features for robust grasp point detection under glare.

- Calibrated camera frames with an AprilTag board and automated offsets.
- Added an uncertainty-aware scorer to reject unstable grasps.
- Deployed the pipeline on a Jetson Orin for low-latency execution.

Next up: pairing this with tactile feedback to adapt grasps when packages flex in transit.
