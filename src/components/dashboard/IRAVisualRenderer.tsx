"use client";

import type { VisualPayload } from "./types";

interface Props {
visual: VisualPayload;
}

export default function IRAVisualRenderer({ visual }: Props) {
return ( <section className="my-4 rounded-2xl border border-[#EEE3D1]/15 bg-[#EEE3D1]/[0.03] p-4"> <h3 className="mb-2 text-base font-semibold text-[#EEE3D1]">
{visual.title} </h3>


  {visual.description && (
    <p className="mb-4 text-sm text-[#EEE3D1]/65">
      {visual.description}
    </p>
  )}

  {visual.type === "concept_map" && (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(visual.nodes ?? []).map((node) => (
        <div
          key={node.id}
          className="max-w-full rounded-xl border border-[#EEE3D1]/15 bg-black/20 p-3"
        >
          <p className="font-medium text-[#EEE3D1]">{node.label}</p>
          {node.description && (
            <p className="mt-1 text-sm text-[#EEE3D1]/65">
              {node.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )}

  {(visual.type === "flowchart" || visual.type === "steps") && (
    <div className="mx-auto flex max-w-md flex-col items-center gap-2">
      {(visual.steps ?? []).map((step, index) => (
        <div key={`${step.title}-${index}`} className="w-full text-center">
          <div className="rounded-xl border border-[#EEE3D1]/15 bg-black/20 p-3">
            <p className="text-xs text-[#EEE3D1]/45">
              STEP {index + 1}
            </p>
            <p className="mt-1 font-medium text-[#EEE3D1]">
              {step.title}
            </p>
            {step.description && (
              <p className="mt-1 text-sm text-[#EEE3D1]/65">
                {step.description}
              </p>
            )}
          </div>

          {index < (visual.steps ?? []).length - 1 && (
            <div className="py-1 text-xl text-[#EEE3D1]/60" aria-hidden="true">
              ↓
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  {visual.type === "comparison" && (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {(visual.columns ?? []).map((column) => (
          <h4
            key={column}
            className="rounded-lg bg-black/20 p-3 text-center text-sm font-semibold text-[#EEE3D1]"
          >
            {column}
          </h4>
        ))}
      </div>

      {(visual.comparisons ?? []).map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="grid grid-cols-2 gap-3"
        >
          {item.values.map((value, valueIndex) => (
            <div
              key={`${item.label}-${valueIndex}`}
              className="rounded-lg border border-[#EEE3D1]/10 p-3"
            >
              <p className="text-xs text-[#EEE3D1]/45">{item.label}</p>
              <p className="mt-1 text-sm text-[#EEE3D1]/85">{value}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )}
</section>


);
}
