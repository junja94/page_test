# Safety-first motion planning
Authors: Daniel Park
Date: 2025-06-28
Image: media/thumbnails/left_to_right.gif 
Description: SDF + human pose fusion for dynamic stop zones without sacrificing cycle time.
Publication: https://example.com/paper

We released an updated trajectory planner that fuses signed distance fields with near-real-time human pose estimation. The planner now reasons about stop zones dynamically while preserving cycle time.

- Added velocity-adaptive clearance based on predicted human paths.
- Tuned jerk limits to avoid payload sway while braking.
- Integrated with our safety PLC via OPC-UA for synchronized stops.
