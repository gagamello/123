# Discipline Program

This repository contains a simple command-line program for tracking tasks and building self-discipline.

## Usage

```bash
# Add a new task
python discipline_program.py add "Read 10 pages of a book"

# List current tasks
python discipline_program.py list

# Mark a task as complete
python discipline_program.py done 1
```

Tasks are stored in `tasks.json` in the repository directory.

## GUI

You can manage tasks with a simple graphical interface:

```bash
python discipline_gui.py
```

The window lists existing tasks and lets you add or remove them.
