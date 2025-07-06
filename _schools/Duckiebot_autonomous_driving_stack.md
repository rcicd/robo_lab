---
layout: school-detail
name: "Duckiebot autonomous driving stack student's project"
image: "/assets/img/schools/duckiebot_autonomous_driving_stack.jpg" 
description: "Developing an autonomous driving stack for Duckiebot hardware platform using ROS2."
tags:
    - "Project"
    - "Robotics"
    - "Offline"

---
## Project description 
The goal of this project is to develop an autonomous driving stack for Duckiebot hardware platform using ROS2.
The final system should enable the robot to navigate a city-like environment and follow road
markings.

The robot should be capable of:

 * Following road markings autonomously
 * Navigating through intersections
 * Localize itself in the environment using April Tags placed at intersections
 * Follow a predefined (possibly looped) route
 * Emergency stop in front of large object
 * Understand and follow traffic light colors

### Key technologies 
* Ros2 
* Linux
* Python

### Outcomes
To achieve these goals students had to understand the ROS2 framework,
learn how to work with robot's sensors and actuators, 
and implement a set of nodes that can perform the target actions.
Working with robots is not trivial, starting with the launch of the 
project. Robots operate in the real world with a great deal of uncertainty, 
and quite often a situation arises where a program that was just working perfectly starts to throw errors.
The students coped perfectly with all the challenges.
As a result student got an application that can do each of the target 
actions and combine all of this in one ROS2 node, that sequentially calls the rest nodes. 
You can see <a href="https://github.com/DuckiebotNup2025SpringProject/Driving">project repository</a>.
