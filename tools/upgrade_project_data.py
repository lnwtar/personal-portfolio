import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "projects.json"


def gallery(slug, captions):
    items = []
    for index, caption in enumerate(captions, 1):
        stem = f"assets/projects/{slug}/gallery-{index:02d}"
        items.append(
            {
                "src": f"{stem}-1600.webp",
                "srcset": f"{stem}-960.webp 960w, {stem}-1600.webp 1600w",
                "alt": caption,
                "caption": caption,
            }
        )
    return items


UPDATES = {
    "v-resq": {
        "solution": "The prototype combines a VR operator interface, distributed robot-control services, live telemetry, and explicit safety states so an operator can understand and control the remote system from one workflow.",
        "gallery": gallery("v-resq", [
            "V-ResQ research presentation showing the project concept and system context.",
            "Binary UDP protocol diagram used to describe control communication.",
            "Hardware and software overview for the V-ResQ prototype.",
            "Team-management and timeline screen from the project presentation.",
            "V-ResQ team presentation slide documenting the project group.",
            "V-ResQ web console showing system overview and connection states.",
            "Protocol and telemetry status screen in the operator console.",
            "Operator console screen documenting control and safety panels.",
            "Telemetry-focused console view from the later prototype iteration.",
        ]),
    },
    "badminton-pose-analysis": {
        "solution": "A local web workflow accepts video or webcam input, detects body landmarks, classifies stroke phases, and presents technique feedback in a readable dashboard instead of exposing raw landmark data.",
        "gallery": gallery("badminton-pose-analysis", [
            "Early badminton analysis screen with video playback and stroke feedback.",
            "Pose-analysis dashboard showing technique metrics beside the source video.",
            "Input and calibration screen for the badminton analysis workflow.",
            "Analysis result with pose overlay, stroke score, and movement feedback.",
            "Dashboard comparison view for badminton movement evaluation.",
            "Later badminton analysis prototype with pose landmarks and live metrics.",
        ]),
    },
    "smart-rehab": {
        "solution": "The Unity prototype maps sensor input to a simple runner-style activity while keeping force, angle, repetitions, and score visible as immediate exercise feedback.",
        "gallery": gallery("smart-rehab", [
            "Unity rehabilitation game prototype with a boat-based movement scene.",
            "Game view used to test movement feedback and obstacle timing.",
            "Prototype scene showing the exercise-controlled character and environment.",
            "Unity editor view documenting rehabilitation-game interface iteration.",
            "Gameplay feedback iteration with visual movement cues in the Unity scene.",
            "Later prototype screen showing updated environment and feedback elements.",
        ]),
    },
    "fashion-ecommerce": {
        "solution": "The application uses a consistent catalog system, reusable product cards, persistent cart state, and dedicated customer and seller flows across a Node.js and MySQL-backed multi-page store.",
        "gallery": gallery("fashion-ecommerce", [
            "Fashion store landing page with campaign imagery and primary navigation.",
            "Desktop home page showing product discovery and featured content.",
            "Category listing screen with filters and a responsive product grid.",
            "Product-detail page with imagery, options, price, and purchase action.",
            "Admin or seller management screen connected to the store workflow.",
            "Merchandise detail screen showing the product gallery and selection controls.",
        ]),
        "github": "https://github.com/lnwtar/shopping_Project",
        "githubLabel": "Web Shopping on GitHub",
    },
    "vr-hospital": {
        "solution": "A structured Unity XR journey uses environmental landmarks, consistent interactable cues, audio, and an explicit end state to guide users through the hospital and dental-clinic space.",
        "gallery": gallery("vr-hospital", [
            "Unity editor view of the hospital reception and waiting environment.",
            "Hospital corridor scene used to evaluate spatial navigation and scale.",
            "In-world waiting interaction with a visible guidance panel.",
            "Dental-clinic environment with an interaction prompt in the Unity editor.",
            "Hospital prototype play view showing room layout and interface cues.",
            "Detailed clinical-room scene from the completed environment iteration.",
        ]),
    },
    "countball": {
        "solution": "The Unity game uses a compact start-to-play loop, physics-based ball spawning, basket interaction, scoring, and scene-state scripts packaged for Android testing.",
        "gallery": gallery("countball", [
            "Unity editor view documenting the ball-spawning gameplay prototype.",
            "CountBall game scene with interactive objects and mobile-oriented controls.",
            "Gameplay test view showing ball and basket interaction in the scene.",
            "Unity setup screen used while tuning the core counting loop.",
            "Later gameplay iteration with updated scene and interaction state.",
            "CountBall test scene documenting the packaged game workflow.",
        ]),
    },
    "bathub-whale-ar": {
        "solution": "The Unity and Vuforia build organizes image targets into separate scenes and pairs them with lightweight rotation, lighting, and menu controls for mobile use.",
        "gallery": [],
        "missingImages": [
            "A phone screenshot showing the whale model anchored to its image target.",
            "The BATHUB WHALE main menu and target-selection flow.",
            "A close view of the rotation and lighting controls in use.",
        ],
    },
    "seizure-mission-roblox": {
        "solution": "A mission-based Roblox experience places guidance inside a familiar school scenario, using NPC dialogue, decision screens, environmental cues, and feedback to reinforce seizure-response knowledge.",
        "gallery": gallery("seizure-mission-roblox", [
            "Roblox Studio NPC dialogue prototype inside the school environment.",
            "Classroom and hallway scene used for the educational mission flow.",
            "Roblox school environment documenting an early level-layout iteration.",
            "Mission prototype with an in-game character and health-learning prompt.",
            "Decision screen used to guide a player through the response scenario.",
            "In-game choice interface presenting seizure-response actions.",
            "NPC interaction in the outdoor school environment.",
        ]),
    },
    "ai-human-detection": {
        "solution": "The module structures labeled posture data for YOLO training, validates predictions visually, and prepares an inference workflow intended for an edge-computing target.",
        "gallery": gallery("ai-human-detection", [
            "Validation batch with predicted bounding boxes and posture classes.",
            "Second validation batch showing predicted people and posture labels.",
            "Additional validation batch from the YOLO experiment output.",
            "Confusion matrix generated by the detection validation run.",
            "Precision–recall curves produced by the YOLO experiment.",
        ]),
    },
    "aruco-tracking": {
        "solution": "The project generates known ArUco markers, detects them through OpenCV, and exposes marker position and orientation data to the wider robot-testing workflow.",
        "gallery": gallery("aruco-tracking", [
            "Generated ArUco marker 0 used by the tracking workflow.",
            "Generated ArUco marker 1 used for multi-marker testing.",
        ]),
        "missingImages": [
            "A camera-frame screenshot with detected marker corners and ID overlay.",
            "A robot test showing position data beside the live camera feed.",
        ],
        "github": "https://github.com/lnwtar/backOceanX",
    },
    "hall-sensor-system": {
        "solution": "The embedded logic combines calibration, rolling averages, hysteresis, confirmation counters, and an adaptive baseline to convert unstable analog readings into predictable detection states.",
        "gallery": [],
        "missingImages": [
            "A top-down photo showing all 9 KY-035 sensor positions.",
            "A serial-monitor screenshot showing calibrated sensor values and trigger states.",
            "A short test sequence showing the magnet moving across the sensor grid.",
        ],
        "github": "https://github.com/lnwtar/backOceanX",
    },
    "onshape-product-modeling": {
        "solution": "The collection uses dimensioned sketches, extrusions, lofts, part transforms, and assembly relationships to explore product proportions and multi-part construction.",
        "gallery": gallery("onshape-product-modeling", [
            "Onshape model of a multi-part product stand with stepped and angled geometry.",
            "Onshape model of a stylus-shaped handheld device.",
            "Onshape scissors assembly showing the completed multi-part form.",
        ]),
        "missingImages": [
            "If the perfume-bottle model is recovered, add one clean isometric view and one close view of the cap and body transitions.",
        ],
    },
}


def main():
    projects = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    for project in projects:
        update = UPDATES[project["slug"]]
        project.update(update)
        project.pop("image", None)
        project.pop("imageAlt", None)
        project["contributions"] = project["role"]
        if project.get("gallery"):
            project["cover"] = project["gallery"][0]
        else:
            project["cover"] = None
        project.setdefault("missingImages", [])
    DATA_PATH.write_text(json.dumps(projects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
