"""
Seed script for RailOpt Flow (SIH26027 · Team AETHER)
Generates realistic Indian Railways operational dataset:
- 8 tracks across 3 corridors (Delhi Division)
- 30 train movements (Rajdhani, Shatabdi, Vande Bharat, Express, Freight)
- 20 maintenance requests (Engineering, S&T, Electrical)
- 4 pre-existing scheduling conflicts
- 4 system users (Planner, Coordinators)
"""
import datetime
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.corridor import Corridor
from app.models.train_movement import TrainMovement
from app.models.maintenance_request import MaintenanceRequest
from app.models.block import Block
from app.models.conflict import Conflict
from app.models.optimization_run import OptimizationRun
from app.models.user import User


def seed_database():
    print("Connecting to database and initializing tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_tracks = db.query(Corridor).count()
        if existing_tracks >= 8:
            print(f"Database already contains {existing_tracks} tracks. Clearing existing seed data to refresh...")
            db.query(Conflict).delete()
            db.query(Block).delete()
            db.query(MaintenanceRequest).delete()
            db.query(TrainMovement).delete()
            db.query(Corridor).delete()
            db.query(OptimizationRun).delete()
            db.query(User).delete()
            db.commit()

        print("Seeding 8 Tracks across 3 Corridors...")
        tracks_data = [
            # Corridor 1: NDLS - AGC (New Delhi - Agra Cantt)
            {"name": "T-101", "zone": "Northern Railway", "division": "DLI", "current_status": "available"},
            {"name": "T-102", "zone": "Northern Railway", "division": "DLI", "current_status": "block"},
            {"name": "T-103", "zone": "Northern Railway", "division": "AGC", "current_status": "available"},
            {"name": "T-104", "zone": "Northern Railway", "division": "AGC", "current_status": "conflict"},
            
            # Corridor 2: DLI - GZB (Delhi Jn - Ghaziabad)
            {"name": "T-201", "zone": "Northern Railway", "division": "DLI", "current_status": "conflict"},
            {"name": "T-202", "zone": "Northern Railway", "division": "DLI", "current_status": "available"},
            
            # Corridor 3: NDLS - CNB (New Delhi - Kanpur Central)
            {"name": "T-301", "zone": "Northern Railway", "division": "DLI", "current_status": "maintenance"},
            {"name": "T-302", "zone": "Northern Railway", "division": "DLI", "current_status": "available"},
        ]

        tracks = []
        for t in tracks_data:
            track = Corridor(**t)
            db.add(track)
            tracks.append(track)
        db.commit()

        # Map track name to DB instance
        track_map = {t.name: t for t in db.query(Corridor).all()}

        print("Seeding 4 System Users & Coordinators...")
        users_data = [
            {"name": "Rajesh Sharma", "email": "rajesh.controller@railnet.gov.in", "role": "planner", "department": "Traffic"},
            {"name": "Vikram Adhikari", "email": "vikram.eng@railnet.gov.in", "role": "coordinator", "department": "Engineering"},
            {"name": "Pooja Verma", "email": "pooja.snt@railnet.gov.in", "role": "coordinator", "department": "S&T"},
            {"name": "Amitabh Sen", "email": "amitabh.elec@railnet.gov.in", "role": "coordinator", "department": "Electrical"},
        ]
        for u in users_data:
            db.add(User(**u))
        db.commit()

        print("Seeding 30 Train Movements across timetable...")
        base_time = datetime.datetime.utcnow().replace(minute=0, second=0, microsecond=0)
        
        trains_data = [
            # High Priority (Priority 1)
            ("12004", "T-101", 6, 8, 1),    # Swarna Shatabdi
            ("12951", "T-102", 7, 9, 1),    # Mumbai Rajdhani
            ("22436", "T-101", 14, 16, 1),  # Vande Bharat Express
            ("12424", "T-104", 10, 12, 1),  # Dibrugarh Rajdhani
            ("12002", "T-103", 8, 10, 1),   # Bhopal Shatabdi
            ("12260", "T-301", 11, 13, 1),  # Sealdah Duronto
            ("12432", "T-102", 15, 17, 1),  # Trivandrum Rajdhani
            ("20818", "T-302", 16, 18, 1),  # Bhubaneswar Tejas
            
            # Mail & Express (Priority 2)
            ("12419", "T-201", 5, 7, 2),    # Gomti Express
            ("14006", "T-202", 7, 9, 2),    # Lichchavi Express
            ("12398", "T-301", 8, 10, 2),   # Mahabodhi Express
            ("12554", "T-302", 9, 11, 2),   # Vaishali Express
            ("12802", "T-101", 10, 12, 2),  # Purushottam Express
            ("12402", "T-103", 11, 13, 2),  # Magadh Express
            ("12392", "T-201", 12, 14, 2),  # Shramjeevi Express
            ("14218", "T-202", 13, 15, 2),  # Unchahar Express
            ("12456", "T-102", 18, 20, 2),  # Bikaner Express
            ("14316", "T-301", 19, 21, 2),  # Intercity Express
            ("12056", "T-104", 20, 22, 2),  # Dehradun Jan Shatabdi
            ("12060", "T-101", 21, 23, 2),  # Kota Jan Shatabdi
            
            # Suburban / EMU / Passenger (Priority 3)
            ("54058", "T-201", 6, 8, 3),    # DLI-GZB Passenger
            ("64424", "T-202", 8, 10, 3),   # GZB-NDLS EMU
            ("64402", "T-103", 14, 16, 3),  # DLI-PWL Local
            ("64902", "T-104", 16, 18, 3),  # TKD-PWL Shuttle
            
            # Freight Rakes (Priority 3)
            ("FRT-8821", "T-301", 2, 5, 3),  # BTPN Petroleum Tanker
            ("FRT-9043", "T-301", 9, 12, 3),  # BOXN Heavy Coal Rake
            ("FRT-7102", "T-103", 3, 6, 3),  # BCNHL Cement Rake
            ("FRT-6091", "T-201", 1, 4, 3),  # CONCOR Container Rake
            ("FRT-4432", "T-202", 17, 20, 3),# SAIL Steel Rake
            ("FRT-5519", "T-102", 22, 25, 3),# AFTO Auto Rake
        ]

        for train_no, trk_name, dep_offset, arr_offset, priority in trains_data:
            dep_time = base_time + datetime.timedelta(hours=dep_offset)
            arr_time = base_time + datetime.timedelta(hours=arr_offset)
            t_obj = TrainMovement(
                train_no=train_no,
                corridor_id=track_map[trk_name].id,
                scheduled_departure=dep_time,
                scheduled_arrival=arr_time,
                priority=priority
            )
            db.add(t_obj)
        db.commit()

        print("Seeding 20 Maintenance Requests across departments...")
        reqs_data = [
            # Engineering (7 requests)
            {"wo": "WO-ENG-2026-081", "dept": "Engineering", "track": "T-101", "act": "Track Tamping (09-3X Machine)", "dur": 3.0, "pri": "critical", "status": "pending"},
            {"wo": "WO-ENG-2026-082", "dept": "Engineering", "track": "T-102", "act": "High-Output Ballast Cleaning (BCM)", "dur": 4.0, "pri": "high", "status": "scheduled"},
            {"wo": "WO-ENG-2026-083", "dept": "Engineering", "track": "T-103", "act": "Deep Screening of Turnouts", "dur": 3.5, "pri": "medium", "status": "pending"},
            {"wo": "WO-ENG-2026-084", "dept": "Engineering", "track": "T-104", "act": "Rail Ultrasonic Testing (USFD Rake)", "dur": 2.5, "pri": "high", "status": "pending"},
            {"wo": "WO-ENG-2026-085", "dept": "Engineering", "track": "T-201", "act": "Turnout Diamond Cross Renewal", "dur": 4.0, "pri": "critical", "status": "pending"},
            {"wo": "WO-ENG-2026-086", "dept": "Engineering", "track": "T-202", "act": "Switch Expansion Joint Adjustment", "dur": 2.0, "pri": "low", "status": "pending"},
            {"wo": "WO-ENG-2026-087", "dept": "Engineering", "track": "T-301", "act": "Mobile Flash Butt Rail Welding", "dur": 3.0, "pri": "high", "status": "scheduled"},

            # S&T (Signalling & Telecom - 7 requests)
            {"wo": "WO-SNT-2026-041", "dept": "S&T", "track": "T-101", "act": "Point Machine 220 Overhaul", "dur": 2.5, "pri": "high", "status": "pending"},
            {"wo": "WO-SNT-2026-042", "dept": "S&T", "track": "T-102", "act": "Glued Insulated Rail Joint Renewal", "dur": 2.0, "pri": "medium", "status": "scheduled"},
            {"wo": "WO-SNT-2026-043", "dept": "S&T", "track": "T-103", "act": "High-Frequency Track Circuit Calibration", "dur": 1.5, "pri": "low", "status": "pending"},
            {"wo": "WO-SNT-2026-044", "dept": "S&T", "track": "T-104", "act": "Electronic Interlocking Logic Validation", "dur": 3.0, "pri": "critical", "status": "pending"},
            {"wo": "WO-SNT-2026-045", "dept": "S&T", "track": "T-201", "act": "Automatic Signalling Aspect Upgrade", "dur": 2.5, "pri": "high", "status": "pending"},
            {"wo": "WO-SNT-2026-046", "dept": "S&T", "track": "T-202", "act": "Digital Axle Counter Head Replacement", "dur": 2.0, "pri": "medium", "status": "pending"},
            {"wo": "WO-SNT-2026-047", "dept": "S&T", "track": "T-302", "act": "Signalling Cable Insulation Meggering", "dur": 1.5, "pri": "low", "status": "pending"},

            # Electrical / Traction (6 requests)
            {"wo": "WO-ELE-2026-011", "dept": "Electrical", "track": "T-101", "act": "OHE Catenary Wire Dropper Renewal", "dur": 3.0, "pri": "high", "status": "pending"},
            {"wo": "WO-ELE-2026-012", "dept": "Electrical", "track": "T-102", "act": "Neutral Section Insulator Replacement", "dur": 3.5, "pri": "critical", "status": "scheduled"},
            {"wo": "WO-ELE-2026-013", "dept": "Electrical", "track": "T-103", "act": "Traction Mast Cantilever Re-alignment", "dur": 2.0, "pri": "medium", "status": "pending"},
            {"wo": "WO-ELE-2026-014", "dept": "Electrical", "track": "T-104", "act": "Substation Isolator Switch Testing", "dur": 2.5, "pri": "high", "status": "pending"},
            {"wo": "WO-ELE-2026-015", "dept": "Electrical", "track": "T-201", "act": "Contact Wire Height & Stagger Correction", "dur": 3.0, "pri": "critical", "status": "pending"},
            {"wo": "WO-ELE-2026-016", "dept": "Electrical", "track": "T-301", "act": "OHE Portal Structure Earthing Overhaul", "dur": 2.0, "pri": "medium", "status": "scheduled"},
        ]

        for req in reqs_data:
            m_obj = MaintenanceRequest(
                work_order_no=req["wo"],
                department=req["dept"],
                track_id=track_map[req["track"]].id,
                activity_type=req["act"],
                duration_hours=req["dur"],
                priority=req["pri"],
                deadline=base_time + datetime.timedelta(days=2),
                status=req["status"]
            )
            db.add(m_obj)
        db.commit()

        print("Seeding active blocks...")
        active_block_1 = Block(
            track_id=track_map["T-102"].id,
            start_time=base_time + datetime.timedelta(hours=1),
            end_time=base_time + datetime.timedelta(hours=5),
            linked_work_orders=["WO-ENG-2026-082", "WO-SNT-2026-042", "WO-ELE-2026-012"],
            source="ai",
            status="active"
        )
        db.add(active_block_1)

        active_block_2 = Block(
            track_id=track_map["T-301"].id,
            start_time=base_time + datetime.timedelta(hours=9),
            end_time=base_time + datetime.timedelta(hours=12),
            linked_work_orders=["WO-ENG-2026-087", "WO-ELE-2026-016"],
            source="manual",
            status="scheduled"
        )
        db.add(active_block_2)
        db.commit()

        print("Seeding 4 Pre-existing Scheduling Conflicts...")
        conflicts_data = [
            {
                "track_id": track_map["T-104"].id,
                "severity": "critical",
                "description": "Critical collision: WO-SNT-2026-044 (Electronic Interlocking) requested during slot for Train 12424 (Dibrugarh Rajdhani, 10:00-12:00) without track possession clearance.",
                "ai_recommendation": "Shift interlocking window to 02:00-05:00 night corridor or re-route Rajdhani via T-103 Up Main loop line.",
                "status": "open"
            },
            {
                "track_id": track_map["T-201"].id,
                "severity": "high",
                "description": "Uncoordinated departmental block: Engineering requested Turnout Renewal (4.0h) while Electrical independently scheduled Contact Wire Stagger (3.0h) on overlapping spans.",
                "ai_recommendation": "Consolidate into single AI coordinated block window from 01:00-05:00, saving 3.0 hours of track downtime and preventing duplicate signal isolations.",
                "status": "open"
            },
            {
                "track_id": track_map["T-101"].id,
                "severity": "critical",
                "description": "Timetable conflict: WO-ENG-2026-081 (Track Tamping 3h) clashes directly with Priority-1 Train 22436 (Vande Bharat Express) departing at 14:00.",
                "ai_recommendation": "Bundle with S&T Point Overhaul (WO-SNT-2026-041) into a single 3.5h midday window from 10:30-14:00, releasing the track 15 minutes before Vande Bharat departure.",
                "status": "open"
            },
            {
                "track_id": track_map["T-301"].id,
                "severity": "medium",
                "description": "Freight disruption risk: Scheduled block (WO-ENG-2026-087 + WO-ELE-2026-016) coincides with peak coal freight path FRT-9043 (BOXN Rake).",
                "ai_recommendation": "Regulate freight departure by +45 minutes at CNB yard to utilize existing block without throughput penalty.",
                "status": "open"
            }
        ]

        for conf in conflicts_data:
            c_obj = Conflict(**conf)
            db.add(c_obj)
        db.commit()

        print("Seeding baseline OptimizationRun snapshot...")
        opt_run = OptimizationRun(
            timestamp=datetime.datetime.utcnow(),
            input_snapshot={"total_requests": 20, "tracks_monitored": 8, "conflicts_detected": 4},
            results={
                "bundled_blocks_created": 4,
                "conflicts_resolved": 3,
                "time_saved_hours": 2.5
            },
            availability_delta=2.4,
            conflict_delta=-73.0,
            delay_risk_delta=-41.0,
            efficiency_delta=18.0,
            status="completed"
        )
        db.add(opt_run)
        db.commit()

        print("[SUCCESS] Database seeding completed successfully!")
        print(f"Summary: {db.query(Corridor).count()} tracks, {db.query(TrainMovement).count()} train movements, "
              f"{db.query(MaintenanceRequest).count()} maintenance requests, {db.query(Conflict).count()} conflicts, "
              f"{db.query(Block).count()} blocks, {db.query(User).count()} users.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
