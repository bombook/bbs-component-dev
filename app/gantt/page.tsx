'use client'

import Script from 'next/script'
import { useMemo, useState } from 'react'
import Gantt_chart, { type GanttTask } from '@/components/gantt/Gantt_chart'

export default function GanttSamplePage() {
  const [isReady, setIsReady] = useState(false)

  const tasks = useMemo<GanttTask[]>(
    () => [
      {
        id: 'planning',
        name: '요구사항 정의',
        start: '2026-03-10',
        end: '2026-03-14',
        progress: 100,
      },
      {
        id: 'design',
        name: 'UI/UX 설계',
        start: '2026-03-15',
        end: '2026-03-20',
        progress: 60,
        dependencies: 'planning',
      },
      {
        id: 'development',
        name: '개발',
        start: '2026-03-21',
        end: '2026-03-30',
        progress: 35,
        dependencies: 'design',
      },
      {
        id: 'test',
        name: '테스트',
        start: '2026-03-31',
        end: '2026-04-03',
        progress: 0,
        dependencies: 'development',
      },
    ],
    []
  )

  return (
    <main className="page">
      <Script
        src="https://unpkg.com/frappe-gantt/dist/frappe-gantt.umd.js"
        strategy="afterInteractive"
        onLoad={() => setIsReady(true)}
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/frappe-gantt/dist/frappe-gantt.css"
      />

      <section className="container">
        <h1>Frappe Gantt 샘플</h1>
        <p>frappe-gantt를 이용해 프로젝트 일정을 시각화한 예시입니다.</p>
        <Gantt_chart tasks={tasks} ready={isReady} />
      </section>
    </main>
  )
}
