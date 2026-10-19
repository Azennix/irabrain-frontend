"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import ProtectedPageLayout from "@/components/layout/ProtectedPageLayout";

import { useAuth } from "@/lib/auth/AuthProvider";

import {
  getProjects,
  createConversation,
  type ProjectItem,
} from "@/services/api/brainApi";

import ProjectCard from "./components/ProjectCard";
import ProjectFilters from "./components/ProjectFilters";
import CreateProjectModal from "./components/CreateProjectModal";

import type { ProjectStatus } from "./types";

export default function ProjectsPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [projects, setProjects] =
    useState<ProjectItem[]>([]);

  const [activeStatus, setActiveStatus] =
    useState<"all" | ProjectStatus>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProjects() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProjects(token!);

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        console.error(
          "Failed to load projects:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load your projects."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredProjects = useMemo(() => {
    if (activeStatus === "all") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.status === activeStatus
    );
  }, [projects, activeStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const project of projects) {
      counts[project.status] =
        (counts[project.status] ?? 0) + 1;
    }

    return counts;
  }, [projects]);

  function handleProjectCreated(
    project: ProjectItem
  ) {
    setProjects((current) => [
      project,
      ...current,
    ]);

    setIsCreateOpen(false);
  }

  function handleOpenProject(
    project: ProjectItem
  ) {
    router.push(
      `/projects/${encodeURIComponent(project.id)}`
    );
  }

  async function handleAskIRA(project: ProjectItem) {
  if (!token) {
    return;
  }

  try {
    const conversation = await createConversation(
      token,
      `${project.name} — IRA`
    );

    const conversationId =
      conversation.conversation_id;

    if (!conversationId) {
      throw new Error(
        "Conversation was created without an ID."
      );
    }

    router.push(
      `/chat?conversation=${encodeURIComponent(
        conversationId
      )}&project=${encodeURIComponent(project.id)}`
    );
  } catch (error) {
    console.error(
      "Failed to create IRA project conversation:",
      error
    );
  }
}

  return (
    <ProtectedPageLayout>
      <main
        className="
          mx-auto w-full max-w-[1180px]
          px-4 pb-28 pt-[76px]
          sm:px-6
          md:px-8 md:pb-16 md:pt-12
        "
      >
        {/* HEADER */}

        <section>
          <div
            className="
              flex flex-col gap-6
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
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

                Workspace
              </div>

              <h1
                className="
                  mt-3
                  text-[32px]
                  font-normal
                  tracking-[-0.035em]
                  sm:text-[40px]
                "
              >
                Projects
              </h1>

              <p
                className="
                  mt-3 max-w-[560px]
                  text-sm leading-6
                  text-[var(--muted)]
                  sm:text-[15px]
                "
              >
                Projects give IRA a structured
                understanding of what you are
                building and where you want to go.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsCreateOpen(true)
              }
              className="
                rounded-xl
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-4 py-3
                text-xs
                font-medium
                transition-colors
                hover:border-[var(--foreground)]/20
              "
            >
              + New project
            </button>
          </div>
        </section>

        {/* FILTERS */}

        <ProjectFilters
          activeStatus={activeStatus}
          statusCounts={statusCounts}
          onStatusChange={setActiveStatus}
        />

        {/* PROJECT CONTENT */}

        <section className="mt-8">
          {isLoading ? (
            <div
              className="
                grid grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-[230px]
                    animate-pulse
                    rounded-[22px]
                    border border-[var(--border)]
                    bg-[var(--surface-soft)]
                  "
                />
              ))}
            </div>
          ) : error ? (
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
                {error}
              </p>

              <p
                className="
                  mt-2 text-xs
                  text-[var(--muted)]
                "
              >
                Please refresh the page
                and try again.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div
              className="
                rounded-[24px]
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-6 py-20
                text-center
              "
            >
              <h2 className="text-[15px] font-medium">
                {projects.length === 0
                  ? "Your workspace is ready."
                  : "No projects in this status."}
              </h2>

              <p
                className="
                  mx-auto mt-2
                  max-w-[440px]
                  text-[13px]
                  leading-6
                  text-[var(--muted)]
                "
              >
                {projects.length === 0
                  ? "Create your first project to give IRA a structured place to understand your work."
                  : "Try another project status to see your projects."}
              </p>
            </div>
          ) : (
            <div
              className="
                grid grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {filteredProjects.map(
                (project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={
                      handleOpenProject
                    }
                    onAskIRA={
                    handleAskIRA
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </main>

      {/* CREATE PROJECT */}

      {isCreateOpen && token && (
        <CreateProjectModal
          token={token}
          onClose={() =>
            setIsCreateOpen(false)
          }
          onCreated={
            handleProjectCreated
          }
        />
      )}
    </ProtectedPageLayout>
  );
}