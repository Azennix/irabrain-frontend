"use client";

import { useState } from "react";
import type {
  VisualPayload,
  VisualNode,
  VisualEdge,
} from "./types";

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
    <div
      key={node.id}
      className="min-w-0 flex-1 rounded-xl border border-[#EEE3D1]/20 bg-black/25 p-3 text-center"
    >
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#EEE3D1]/45">
        Node {index + 1}
      </div>
      <div className="break-words font-medium text-[#EEE3D1]">
        {node.label}
      </div>
      {node.description && (
        <p className="mt-2 break-words text-sm leading-5 text-[#EEE3D1]/65">
          {node.description}
        </p>
      )}
    </div>
  );
}

function EdgeLabel({ edge }: { edge: VisualEdge }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center px-2 py-1">
      {edge.label && (
        <span className="mb-1 max-w-28 text-center text-xs text-[#EEE3D1]/60">
          {edge.label}
        </span>
      )}
      <span aria-hidden="true" className="text-xl text-[#EEE3D1]/60">
        ↓
      </span>
    </div>
  );
}

export default function IRAVisualRenderer({ visual, content = "" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);

  const nodes = visual.nodes ?? [];
  const edges = visual.edges ?? [];
  const steps = visual.steps ?? [];

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const isConnectedFlowchart =
    visual.type === "flowchart" &&
    nodes.length > 0 &&
    edges.length > 0;

  return (
    <section className="my-3 overflow-hidden rounded-2xl border border-[#EEE3D1]/15 bg-[#171614]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[#EEE3D1]/[0.06]"
      >
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-[#EEE3D1]">
            {visual.title || "Visual structure"}
          </h3>
          <p className="mt-1 text-sm text-[#EEE3D1]/55">
            {expanded ? "Hide visual" : "Explore visual"}
          </p>
        </div>
        <span className="shrink-0 text-xl text-[#EEE3D1]/70" aria-hidden="true">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[#EEE3D1]/10 p-4">
          {visual.description && (
            <p className="mb-4 text-sm leading-6 text-[#EEE3D1]/70">
              {visual.description}
            </p>
          )}

          {visual.type === "flowchart" && (
            <div className="mx-auto flex max-w-xl flex-col items-stretch">
              {isConnectedFlowchart ? (
                <>
                  {nodes.map((node, index) => (
                    <div key={node.id}>
                      <VisualNodeCard node={node} index={index} />
                      {index < nodes.length - 1 && (
                        <EdgeLabel
                          edge={
                            edges.find(
                              (edge) =>
                                edge.from === node.id &&
                                edge.to === nodes[index + 1]?.id,
                            ) ?? {
                              from: node.id,
                              to: nodes[index + 1]?.id ?? "",
                            }
                          }
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : steps.length > 0 ? (
                steps.map((step, index) => (
                  <div key={`${step.title}-${index}`}>
                    <div className="rounded-xl border border-[#EEE3D1]/20 bg-black/25 p-3 text-center">
                      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#EEE3D1]/45">
                        Step {index + 1}
                      </div>
                      <p className="font-medium text-[#EEE3D1]">{step.title}</p>
                      {step.description && (
                        <p className="mt-2 text-sm text-[#EEE3D1]/65">
                          {step.description}
                        </p>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <EdgeLabel
                        edge={{
                          from: String(index),
                          to: String(index + 1),
                        }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#EEE3D1]/60">
                  No flowchart nodes were returned for this visual.
                </p>
              )}
            </div>
          )}

          {visual.type === "concept_map" && (
            <div className="space-y-3">
              {nodes.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {nodes.map((node, index) => (
                      <VisualNodeCard key={node.id} node={node} index={index} />
                    ))}
                  </div>

                  {edges.length > 0 && (
                    <div className="space-y-2 rounded-xl border border-[#EEE3D1]/10 p-3">
                      <p className="text-xs uppercase tracking-wider text-[#EEE3D1]/45">
                        Relationships
                      </p>
                      {edges.map((edge, index) => (
                        <p
                          key={`${edge.from}-${edge.to}-${index}`}
                          className="break-words text-sm text-[#EEE3D1]/75"
                        >
                          {nodeById.get(edge.from)?.label ?? edge.from}
                          {" → "}
                          {nodeById.get(edge.to)?.label ?? edge.to}
                          {edge.label ? ` · ${edge.label}` : ""}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-[#EEE3D1]/60">
                  No concepts were returned for this visual.
                </p>
              )}
            </div>
          )}

          {visual.type === "steps" && (
            <div className="mx-auto flex max-w-xl flex-col">
              {steps.map((step, index) => (
                <div key={`${step.title}-${index}`}>
                  <div className="rounded-xl border border-[#EEE3D1]/20 bg-black/25 p-3">
                    <p className="text-xs uppercase tracking-wider text-[#EEE3D1]/45">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 font-medium text-[#EEE3D1]">
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-2 text-sm leading-5 text-[#EEE3D1]/65">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <EdgeLabel
                      edge={{
                        from: String(index),
                        to: String(index + 1),
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {visual.type === "comparison" && (
            <div className="space-y-3">
              {visual.columns && visual.columns.length > 0 && (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${visual.columns.length}, minmax(0, 1fr))` }}>
                  {visual.columns.map((column) => (
                    <div
                      key={column}
                      className="rounded-lg border border-[#EEE3D1]/15 p-2 text-center text-sm font-semibold text-[#EEE3D1]"
                    >
                      {column}
                    </div>
                  ))}
                </div>
              )}

              {(visual.comparisons ?? []).map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="rounded-xl border border-[#EEE3D1]/10 p-3"
                >
                  <p className="mb-2 text-sm font-semibold text-[#EEE3D1]">
                    {item.label}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.values.map((value, valueIndex) => (
                      <p
                        key={`${valueIndex}-${value}`}
                        className="break-words rounded-lg bg-black/20 p-2 text-sm leading-5 text-[#EEE3D1]/70"
                      >
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {content.trim() && (
        <div className="border-t border-[#EEE3D1]/10">
          <button
            type="button"
            onClick={() => setTextExpanded((current) => !current)}
            aria-expanded={textExpanded}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-[#EEE3D1]/80 transition-colors hover:bg-[#EEE3D1]/[0.06]"
          >
            <span>
              {textExpanded ? "Hide Text Response" : "View Text Response"}
            </span>
            <span aria-hidden="true">
              {textExpanded ? "−" : "+"}
            </span>
          </button>

          {textExpanded && (
            <div className="border-t border-[#EEE3D1]/10 px-4 py-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#EEE3D1]/80">
                {content}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}