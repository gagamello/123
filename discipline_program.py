import json
import argparse
from pathlib import Path

TASKS_FILE = Path("tasks.json")

def load_tasks():
    if TASKS_FILE.exists():
        with TASKS_FILE.open("r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with TASKS_FILE.open("w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)

def add_task(description):
    tasks = load_tasks()
    task_id = max([t["id"] for t in tasks], default=0) + 1
    tasks.append({"id": task_id, "desc": description, "done": False})
    save_tasks(tasks)
    print(f"Task #{task_id} added: {description}")

def list_tasks():
    tasks = load_tasks()
    if not tasks:
        print("No tasks found.")
        return
    for t in tasks:
        status = "✔" if t["done"] else "✗"
        print(f"{t['id']}: [{status}] {t['desc']}")

def complete_task(task_id):
    tasks = load_tasks()
    for t in tasks:
        if t["id"] == task_id:
            t["done"] = True
            save_tasks(tasks)
            print(f"Task #{task_id} marked as complete.")
            return
    print(f"Task #{task_id} not found.")

def parse_args():
    parser = argparse.ArgumentParser(description="Simple discipline task tracker")
    subparsers = parser.add_subparsers(dest="command", required=True)

    add_p = subparsers.add_parser("add", help="Add a new task")
    add_p.add_argument("description", help="Task description")

    list_p = subparsers.add_parser("list", help="List all tasks")

    done_p = subparsers.add_parser("done", help="Mark a task as complete")
    done_p.add_argument("id", type=int, help="Task ID")

    return parser.parse_args()


def main():
    args = parse_args()
    if args.command == "add":
        add_task(args.description)
    elif args.command == "list":
        list_tasks()
    elif args.command == "done":
        complete_task(args.id)

if __name__ == "__main__":
    main()
