"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";

import {
  getProject,
  getGoals,
  getTasks,
  type TaskItem,
  type ProjectItem,
  type GoalItem,
} from "@/services/api/brainApi";
import CreateGoalModal from "./components/CreateGoalModal";
import EditGoalModal from "./components/EditGoalModal";
import DeleteGoalDialog from "./components/DeleteGoalDialog";

import CreateTaskModal from "./components/CreateTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import DeleteTaskDialog from "./components/DeleteTaskDialog";



export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  

  const projectId = params.projectId as string;

  const [project, setProject] =
    useState<ProjectItem | null>(null);

  const [goals, setGoals] =
    useState<GoalItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);
  
  const [isCreateGoalOpen, setIsCreateGoalOpen] =
  useState(false);

  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<GoalItem | null>(null);
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] =
  useState(false);

  const [editingTask, setEditingTask] =
  useState<TaskItem | null>(null);

  const [deletingTask, setDeletingTask] =
  useState<TaskItem | null>(null);

  useEffect(() => {
    if (!token || !projectId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProject() {
      try {
        setIsLoading(true);
        setError(null);

        const [projectData, goalsData, tasksData] = await Promise.all([
          getProject(token!, projectId),
          getGoals(token!, projectId),
          getTasks(token!, projectId),
]);

        if (!cancelled) {
          setProject(projectData);
          setGoals(goalsData);
          setTasks(tasksData);
        }
      } catch (err) {
        console.error(
          "Failed to load project:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load this project."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [token, projectId]);

  function handleGoalCreated(goal: GoalItem) {
  setGoals((current) => [
    ...current,
    goal,
  ]);

  setIsCreateGoalOpen(false);
}
function handleGoalUpdated(updatedGoal: GoalItem) {
  setGoals((currentGoals) =>
    currentGoals.map((goal) =>
      goal.id === updatedGoal.id
        ? updatedGoal
        : goal
    )
  );

  setEditingGoal(null);
}

function handleGoalDeleted(goalId: string) {
  setGoals((currentGoals) =>
    currentGoals.filter(
      (goal) => goal.id !== goalId
    )
  );

  setDeletingGoal(null);
}


function handleTaskCreated(task: TaskItem) {
  setTasks((current) => [
    ...current,
    task,
  ]);

  setIsCreateTaskOpen(false);
}

function handleTaskUpdated(updatedTask: TaskItem) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === updatedTask.id
        ? updatedTask
        : task
    )
  );

  setEditingTask(null);
}

function handleTaskDeleted(taskId: string) {
  setTasks((currentTasks) =>
    currentTasks.filter(
      (task) => task.id !== taskId
    )
  );

  setDeletingTask(null);
}


  return (
    <MainLayout>
      <div
        className="
        flex
        h-[100dvh]

          min-h-0
          flex-col
          overflow-hidden
          bg-[var(--background)]
          text-[var(--foreground)]
        "
      >
        <div
            className="
            relative
            z-50
            shrink-0
            bg-[var(--background)]
          "
        >
</div>

        <main
  className="
    min-h-0
    flex-1
    overflow-y-auto
    overscroll-contain
  "
>
  <div
    className="
      mx-auto
      w-full
      max-w-[1100px]
      px-4
      pb-28
      pt-8
      sm:px-6
      md:px-8
      md:pb-16
      md:pt-12
    "
  >
            <button
  type="button"
  onClick={() => router.push("/projects")}
  className="
    mb-8
    inline-flex items-center gap-2
    text-[11px]
    uppercase
    tracking-[0.14em]
    text-[var(--muted)]
    transition-colors
    hover:text-[var(--foreground)]
  "
>
  <span aria-hidden="true">←</span>
  Back to Projects
</button>
          {isLoading ? (
            <div className="space-y-4">
              <div
                className="
                  h-10 w-72
                  animate-pulse
                  rounded-lg
                  bg-[var(--surface-soft)]
                "
              />

              <div
                className="
                  h-5 w-[420px]
                  animate-pulse
                  rounded-lg
                  bg-[var(--surface-soft)]
                "
              />
            </div>
          ) : error || !project ? (
            <div
              className="
                rounded-[22px]
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-6 py-16
                text-center
              "
            >
              <p className="text-sm">
                {error ?? "Project not found."}
              </p>
            </div>
          ) : (
            <>
  {/* PROJECT HEADER */}
  <section>
    <div className="border-b border-[var(--border)] pb-8">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div
            className="
              inline-flex items-center gap-2
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-[var(--muted)]
            "
          >
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-[var(--foreground)]/45
              "
            />
            Project
          </div>

          <h1
            className="
              mt-3
              text-[34px]
              font-normal
              tracking-[-0.04em]
              sm:text-[42px]
            "
          >
            {project.name}
          </h1>

          {project.description && (
            <p
              className="
                mt-3
                max-w-[620px]
                text-sm
                leading-6
                text-[var(--muted)]
                sm:text-[15px]
              "
            >
              {project.description}
            </p>
          )}
        </div>

        <span
          className="
            shrink-0
            rounded-full
            border border-[var(--border)]
            px-3
            py-1.5
            text-[10px]
            uppercase
            tracking-[0.12em]
            text-[var(--muted)]
          "
        >
          {project.status}
        </span>
      </div>
    </div>
  </section>

  {/* PROJECT OVERVIEW */}
  <section className="mt-8">
    <div className="mb-4">
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.18em]
          text-[var(--muted)]
        "
      >
        Overview
      </p>

      <h2
        className="
          mt-2
          text-xl
          font-normal
          tracking-[-0.02em]
        "
      >
        Project overview
      </h2>
    </div>

    <div className="grid max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-2">
      <div
        className="
          rounded-[18px]
          border border-[var(--border)]
          bg-[var(--surface-soft)]
          px-5
          py-4
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.14em]
            text-[var(--muted)]
          "
        >
          Status
        </p>

        <p className="mt-3 text-base">
          {project.status}
        </p>
      </div>

      <div
        className="
          rounded-[18px]
          border border-[var(--border)]
          bg-[var(--surface-soft)]
          px-5
          py-4
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.14em]
            text-[var(--muted)]
          "
        >
          Goals
        </p>

        <p className="mt-3 text-base">
          {goals.length}
        </p>
      </div>
    </div>
  </section>

  {/* GOALS */}
  <section className="mt-12">
    <div
      className="
        flex
        items-end
        justify-between
        gap-6
      "
    >
      <div>
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-[var(--muted)]
          "
        >
          Objectives
        </p>

        <h2
          className="
            mt-2
            text-xl
            font-normal
            tracking-[-0.02em]
          "
        >
          Goals
        </h2>

        <p
          className="
            mt-2
            text-[13px]
            leading-6
            text-[var(--muted)]
          "
        >
          The outcomes this project is working toward.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsCreateGoalOpen(true)}
        className="
          shrink-0
          rounded-xl
          border border-[var(--border)]
          bg-[var(--surface-soft)]
          px-4
          py-2.5
          text-xs
          font-medium
          transition-colors
          hover:border-[var(--foreground)]/20
        "
      >
        + Add goal
      </button>
    </div>

    <div className="mt-6">
      {goals.length === 0 ? (
        <div
          className="
            rounded-[20px]
            border border-[var(--border)]
            bg-[var(--surface-soft)]
            px-6
            py-14
            text-center
          "
        >
          <p className="text-sm">
            No goals yet.
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-[420px]
              text-[13px]
              leading-6
              text-[var(--muted)]
            "
          >
            Add a goal to give this project measurable
            direction.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="
                rounded-[20px]
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-5
                py-5
                transition-colors
                hover:border-[var(--foreground)]/15
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-5
                "
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-medium">
                    {goal.title}
                  </h3>

                  {goal.description && (
                    <p
                      className="
                        mt-2
                        max-w-[680px]
                        text-[13px]
                        leading-6
                        text-[var(--muted)]
                      "
                    >
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className="
                      rounded-full
                      border border-[var(--border)]
                      px-2.5
                      py-1
                      text-[10px]
                      uppercase
                      tracking-[0.1em]
                      text-[var(--muted)]
                    "
                  >
                    {goal.status}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingGoal(goal)
                    }
                    className="
                      rounded-lg
                      border border-[var(--border)]
                      px-3
                      py-2
                      text-xs
                      transition-colors
                      hover:border-[var(--foreground)]/20
                    "
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </section>

  {/* TASKS */}
  <section className="mt-12">
    <div
      className="
        flex
        items-end
        justify-between
        gap-6
      "
    >
      <div>
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-[var(--muted)]
          "
        >
          Execution
        </p>

        <h2
          className="
            mt-2
            text-xl
            font-normal
            tracking-[-0.02em]
          "
        >
          Tasks
        </h2>

        <p
          className="
            mt-2
            text-[13px]
            leading-6
            text-[var(--muted)]
          "
        >
          The concrete work needed to move this project forward.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsCreateTaskOpen(true)}
        className="
          shrink-0
          rounded-xl
          border border-[var(--border)]
          bg-[var(--surface-soft)]
          px-4
          py-2.5
          text-xs
          font-medium
          transition-colors
          hover:border-[var(--foreground)]/20
        "
      >
        + Add task
      </button>
    </div>

    <div className="mt-6">
      {tasks.length === 0 ? (
        <div
          className="
            rounded-[20px]
            border border-[var(--border)]
            bg-[var(--surface-soft)]
            px-6
            py-14
            text-center
          "
        >
          <p className="text-sm">
            No tasks yet.
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-[420px]
              text-[13px]
              leading-6
              text-[var(--muted)]
            "
          >
            Add a task to turn this project&apos;s goals
            into concrete work.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="
                rounded-[20px]
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-5
                py-5
                transition-colors
                hover:border-[var(--foreground)]/15
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-5
                "
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-medium">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p
                      className="
                        mt-2
                        max-w-[680px]
                        text-[13px]
                        leading-6
                        text-[var(--muted)]
                      "
                    >
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
  className="
    inline-flex
    items-center
    gap-1.5
    rounded-full
    border border-[var(--border)]
    px-2.5
    py-1
    text-[10px]
    uppercase
    tracking-[0.1em]
    text-[var(--muted)]
  "
>
  <span
    className={`
      h-1.5
      w-1.5
      rounded-full
      ${
        task.status === "active"
          ? "bg-[var(--foreground)]/70"
          : task.status === "completed"
          ? "bg-[var(--foreground)]/45"
          : "bg-[var(--muted)]/40"
      }
    `}
  />

  {task.status}
</span>

                  <button
                    type="button"
                    onClick={() => setEditingTask(task)}
                    className="
                      rounded-lg
                      border border-[var(--border)]
                      px-3
                      py-2
                      text-xs
                      transition-colors
                      hover:border-[var(--foreground)]/20
                    "
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
</>
)}

         </div>
        </main>
        {isCreateGoalOpen && token && (
  <CreateGoalModal
    token={token}
    projectId={projectId}
    onClose={() =>
      setIsCreateGoalOpen(false)
    }
    onCreated={handleGoalCreated}
  />
)}

{isCreateTaskOpen && token && (
  <CreateTaskModal
    token={token}
    projectId={projectId}
    goals={goals}
    onClose={() => setIsCreateTaskOpen(false)}
    onCreated={handleTaskCreated}
  />
)}
{editingTask && token && (
  <EditTaskModal
    token={token}
    projectId={projectId}
    task={editingTask}
    goals={goals}
    onClose={() => setEditingTask(null)}
    onSaved={handleTaskUpdated}
    onDelete={() => {
      setEditingTask(null);
      setDeletingTask(editingTask);
    }}
  />
)}
{editingGoal && token && (
  <EditGoalModal
    token={token}
    projectId={projectId}
    goal={editingGoal}
    onClose={() => setEditingGoal(null)}
    onSaved={handleGoalUpdated}
    onDelete={() => {
  setEditingGoal(null);
  setDeletingGoal(editingGoal);
}}
  />
)}
{deletingGoal && token && (
  <DeleteGoalDialog
    token={token}
    projectId={projectId}
    goal={deletingGoal}
    onClose={() => setDeletingGoal(null)}
    onDeleted={handleGoalDeleted}
  />
)}
{deletingTask && token && (
  <DeleteTaskDialog
    token={token}
    projectId={projectId}
    task={deletingTask}
    onClose={() => setDeletingTask(null)}
    onDeleted={handleTaskDeleted}
  />
)}

      </div>
    </MainLayout>
  );
}
