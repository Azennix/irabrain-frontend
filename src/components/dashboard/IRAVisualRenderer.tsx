
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  GitBranch,
  Lightbulb,
  ListChecks,
  Minus,
  Scale,
} from "lucide-react";

import type {
  VisualPayload,
  VisualNode,
  VisualEdge,
} from "./types";

import IRAMarkdown from "./markdown/IRAMarkdown";

interface Props {
  visual: VisualPayload;
  content?: string;
}

function VisualNodeCard({
  node,
  index,
}: {
  node: VisualNode;
  index: number;
}) {
  return (
    <article
      className="
        min-w-0 w-full rounded-xl
        border border-[#EEE3D1]/15
        bg-[#111110] p-4
        transition-colors duration-200
        hover:border-[#EEE3D1]/25
      "
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="
            flex h-6 w-6 shrink-0 items-center
            justify-center rounded-md
            border border-[#EEE3D1]/10
            bg-[#EEE3D1]/[0.05]
            text-[10px] font-medium
            text-[#EEE3D1]/65
          "
        >
          {index + 1}
        </span>

        <span className="text-[10px] uppercase tracking-[0.16em] text-[#EEE3D1]/40">
          Node
        </span>
      </div>

      <h4 className="break-words text-sm font-semibold leading-6 text-[#EEE3D1]">
        {node.label}
      </h4>

      {node.description && (
        <div className="mt-3 border-t border-[#EEE3D1]/[0.08] pt-3 text-left">
          <IRAMarkdown content={node.description} />
        </div>
      )}
    </article>
  );
}

function Connection({
  edge,
}: {
  edge?: VisualEdge;
}) {
  return (
    <div className="flex min-h-12 flex-col items-center justify-center gap-1 py-1">
      {edge?.label && (
        <span
          className="
            max-w-full rounded-md
            border border-[#EEE3D1]/10
            bg-[#EEE3D1]/[0.035]
            px-2.5 py-1 text-center
            text-xs leading-5 text-[#EEE3D1]/60
          "
        >
          {edge.label}
        </span>
      )}

      <div
        aria-hidden="true"
        className="
          flex h-7 w-7 items-center justify-center
          rounded-full border border-[#EEE3D1]/10
          bg-[#EEE3D1]/[0.04]
          text-[#EEE3D1]/55
        "
      >
        <ChevronDown size={16} strokeWidth={1.6} />
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[#EEE3D1]/55">{icon}</span>
      <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-[#EEE3D1]/55">
        {children}
      </h4>
    </div>
  );
}

export default function IRAVisualRenderer({
  visual,
  content = "",
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [textExpanded, setTextExpanded] = useState(true);

  const nodes = visual.nodes ?? [];
  const edges = visual.edges ?? [];
  const steps = visual.steps ?? [];
  const columns = visual.columns ?? [];
  const comparisons = visual.comparisons ?? [];

  const nodeById = new Map(
    nodes.map((node) => [node.id, node]),
  );

  const isConnectedFlowchart =
    visual.type === "flowchart" &&
    nodes.length > 0;

  const visualIcon = {
    flowchart: <GitBranch size={17} />,
    concept_map: <Lightbulb size={17} />,
    steps: <ListChecks size={17} />,
    comparison: <Scale size={17} />,
  }[visual.type];

  return (
    <section
      className="
        my-4 w-full min-w-0 overflow-hidden
        rounded-2xl border border-[#EEE3D1]/15
        bg-[#171614] shadow-sm
      "
    >
      {/* VISUAL HEADER */}
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="
          flex w-full items-center justify-between gap-4
          px-4 py-4 text-left
          transition-colors duration-200
          hover:bg-[#EEE3D1]/[0.035]
          sm:px-5
        "
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              mt-0.5 flex h-9 w-9 shrink-0
              items-center justify-center rounded-xl
              border border-[#EEE3D1]/10
              bg-[#EEE3D1]/[0.045]
              text-[#EEE3D1]/75
            "
          >
            {visualIcon}
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold leading-6 text-[#EEE3D1] sm:text-base">
              {visual.title || "Visual structure"}
            </h3>

            <p className="mt-0.5 text-xs text-[#EEE3D1]/45">
              {expanded ? "Hide visual" : "Explore visual"}
            </p>
          </div>
        </div>

        <span
          className="
            flex h-8 w-8 shrink-0 items-center
            justify-center rounded-lg
            text-[#EEE3D1]/55
            transition-colors hover:bg-[#EEE3D1]/[0.06]
          "
          aria-hidden="true"
        >
          {expanded ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </span>
      </button>

      {/* VISUAL BODY */}
      {expanded && (
        <div className="border-t border-[#EEE3D1]/10 p-4 sm:p-5">
          {visual.description && (
            <div className="mb-5 text-sm leading-7 text-[#EEE3D1]/70">
              <IRAMarkdown content={visual.description} />
            </div>
          )}

          {/* FLOWCHART */}
          {visual.type === "flowchart" && (
            <div className="mx-auto flex w-full max-w-xl flex-col">
              {isConnectedFlowchart ? (
                nodes.map((node, index) => {
                  const nextNode = nodes[index + 1];

                  const edge = nextNode
                    ? edges.find(
                        (item) =>
                          item.from === node.id &&
                          item.to === nextNode.id,
                      )
                    : undefined;

                  return (
                    <div key={node.id} className="w-full">
                      <VisualNodeCard
                        node={node}
                        index={index}
                      />

                      {nextNode && (
                        <Connection edge={edge} />
                      )}
                    </div>
                  );
                })
              ) : steps.length > 0 ? (
                steps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="w-full"
                  >
                    <article
                      className="
                        rounded-xl border border-[#EEE3D1]/15
                        bg-[#111110] p-4
                        transition-colors hover:border-[#EEE3D1]/25
                      "
                    >
                      <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[#EEE3D1]/40">
                        Step {index + 1}
                      </p>

                      <h4 className="break-words text-sm font-semibold leading-6 text-[#EEE3D1]">
                        {step.title}
                      </h4>

                      {step.description && (
                        <div className="mt-3 border-t border-[#EEE3D1]/[0.08] pt-3 text-left">
                          <IRAMarkdown
                            content={step.description}
                          />
                        </div>
                      )}
                    </article>

                    {index < steps.length - 1 && (
                      <Connection />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[#EEE3D1]/55">
                  No flowchart nodes were returned for this visual.
                </p>
              )}
            </div>
          )}

          {/* CONCEPT MAP */}
          {visual.type === "concept_map" && (
            <div className="space-y-4">
              {nodes.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {nodes.map((node, index) => (
                    <VisualNodeCard
                      key={node.id}
                      node={node}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#EEE3D1]/55">
                  No concepts were returned for this visual.
                </p>
              )}

              {edges.length > 0 && (
                <div className="rounded-xl border border-[#EEE3D1]/10 bg-[#111110]/60 p-4">
                  <SectionHeading icon={<GitBranch size={15} />}>
                    Relationships
                  </SectionHeading>

                  <div className="space-y-2">
                    {edges.map((edge, index) => (
                      <div
                        key={`${edge.from}-${edge.to}-${index}`}
                        className="
                          flex min-w-0 items-start gap-2
                          rounded-lg border border-[#EEE3D1]/[0.07]
                          bg-[#EEE3D1]/[0.025] p-3
                        "
                      >
                        <div className="min-w-0 flex-1 break-words text-sm leading-6 text-[#EEE3D1]/80">
                          {nodeById.get(edge.from)?.label ?? edge.from}
                        </div>

                        <GitBranch
                          size={15}
                          className="mt-1 shrink-0 text-[#EEE3D1]/40"
                          aria-hidden="true"
                        />

                        <div className="min-w-0 flex-1 break-words text-sm leading-6 text-[#EEE3D1]/80">
                          {nodeById.get(edge.to)?.label ?? edge.to}

                          {edge.label && (
                            <p className="mt-1 text-xs text-[#EEE3D1]/45">
                              {edge.label}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEPS */}
          {visual.type === "steps" && (
            <div className="mx-auto flex w-full max-w-xl flex-col">
              {steps.length > 0 ? (
                steps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="w-full"
                  >
                    <article
                      className="
                        rounded-xl border border-[#EEE3D1]/15
                        bg-[#111110] p-4
                        transition-colors hover:border-[#EEE3D1]/25
                      "
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="
                            flex h-6 w-6 items-center
                            justify-center rounded-md
                            border border-[#EEE3D1]/10
                            bg-[#EEE3D1]/[0.045]
                            text-[10px] text-[#EEE3D1]/65
                          "
                        >
                          {index + 1}
                        </span>

                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#EEE3D1]/40">
                          Step
                        </span>
                      </div>

                      <h4 className="break-words text-sm font-semibold leading-6 text-[#EEE3D1]">
                        {step.title}
                      </h4>

                      {step.description && (
                        <div className="mt-3 border-t border-[#EEE3D1]/[0.08] pt-3 text-left">
                          <IRAMarkdown
                            content={step.description}
                          />
                        </div>
                      )}
                    </article>

                    {index < steps.length - 1 && (
                      <Connection />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#EEE3D1]/55">
                  No steps were returned for this visual.
                </p>
              )}
            </div>
          )}

          {/* COMPARISON */}
          {visual.type === "comparison" && (
            <div className="space-y-4">
              {columns.length > 0 && (
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(columns.length, 3)}, minmax(0, 1fr))`,
                  }}
                >
                  {columns.map((column) => (
                    <div
                      key={column}
                      className="
                        flex min-h-12 items-center justify-center
                        rounded-lg border border-[#EEE3D1]/15
                        bg-[#EEE3D1]/[0.035] p-3
                        text-center text-xs font-semibold
                        leading-5 text-[#EEE3D1]/85 sm:text-sm
                      "
                    >
                      {column}
                    </div>
                  ))}
                </div>
              )}

              {comparisons.map((item, index) => (
                <article
                  key={`${item.label}-${index}`}
                  className="
                    rounded-xl border border-[#EEE3D1]/12
                    bg-[#111110] p-4
                  "
                >
                  <h4 className="mb-3 break-words text-sm font-semibold text-[#EEE3D1]">
                    {item.label}
                  </h4>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {item.values.map((value, valueIndex) => (
                      <div
                        key={`${valueIndex}-${value}`}
                        className="
                          min-w-0 rounded-lg
                          border border-[#EEE3D1]/[0.08]
                          bg-[#EEE3D1]/[0.025] p-3
                          text-sm leading-6 text-[#EEE3D1]/75
                        "
                      >
                        <IRAMarkdown content={value} />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULL TEXT RESPONSE */}
      {content.trim() && (
        <div className="border-t border-[#EEE3D1]/10">
          <button
            type="button"
            onClick={() =>
              setTextExpanded((current) => !current)
            }
            aria-expanded={textExpanded}
            className="
              flex w-full items-center justify-between gap-3
              px-4 py-3.5 text-left text-sm
              text-[#EEE3D1]/75
              transition-colors hover:bg-[#EEE3D1]/[0.035]
              sm:px-5
            "
          >
            <span className="flex items-center gap-2">
              {textExpanded ? (
                <EyeOff size={15} strokeWidth={1.7} />
              ) : (
                <Eye size={15} strokeWidth={1.7} />
              )}

              {textExpanded
                ? "Hide Text Response"
                : "View Text Response"}
            </span>

            <span
              className="text-[#EEE3D1]/50"
              aria-hidden="true"
            >
              {textExpanded ? (
                <Minus size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </span>
          </button>

          {textExpanded && (
            <div className="border-t border-[#EEE3D1]/10 px-4 py-4 sm:px-5">
              <IRAMarkdown content={content} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

