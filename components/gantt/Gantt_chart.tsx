'use client'

import { useEffect, useRef } from 'react'

export type GanttTask = {
  id: string
  name: string
  start: string
  end: string
  progress: number
  dependencies?: string
}

type GanttChartProps = {
  tasks: GanttTask[]
  ready: boolean
}

declare global {
  interface Window {
    Gantt?: new (
      container: Element,
      tasks: GanttTask[],
      options?: { view_mode?: string; language?: string }
    ) => { destroy?: () => void }
  }
}

export default function Gantt_chart({ tasks, ready }: GanttChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ready || !svgRef.current || !window.Gantt) {
      return
    }

    const gantt = new window.Gantt(svgRef.current, tasks, {
      view_mode: 'Day',
      language: 'ko',
    })

    return () => {
      gantt.destroy?.()
    }
  }, [ready, tasks])

  return (
    <section className="gantt-wrapper" aria-live="polite">
      {!ready && <p>Gantt 라이브러리를 불러오는 중입니다...</p>}
      <svg ref={svgRef} className="gantt-svg" />
    </section>
  )
}
