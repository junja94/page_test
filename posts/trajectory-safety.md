# Safety-first motion planning
Authors: Daniel Park
Date: 2024-06-28
Image: https://img.youtube.com/vi/dQENgbByNqo/hqdefault.jpg

We released an updated trajectory planner that fuses signed distance fields with near-real-time human pose estimation. The planner now reasons about stop zones dynamically while preserving cycle time.

- Added velocity-adaptive clearance based on predicted human paths.
- Tuned jerk limits to avoid payload sway while braking.
- Integrated with our safety PLC via OPC-UA for synchronized stops.
