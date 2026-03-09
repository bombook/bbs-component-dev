'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'workflow:bpmn-xml';

declare global {
  interface Window {
    BpmnJS?: any;
  }
}

export default function WorkflowViewerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [status, setStatus] = useState('bpmn-js 스크립트 로딩 중...');

  const loadSavedDiagram = async () => {
    if (!viewerRef.current) {
      return;
    }

    const savedXml = localStorage.getItem(STORAGE_KEY);
    if (!savedXml) {
      setStatus('저장된 workflow가 없습니다. 편집 화면에서 먼저 저장해주세요.');
      return;
    }

    await viewerRef.current.importXML(savedXml);
    const canvas = viewerRef.current.get('canvas');
    canvas.zoom('fit-viewport');
    setStatus('저장된 workflow를 조회 중입니다.');
  };

  useEffect(() => {
    return () => {
      viewerRef.current?.destroy?.();
    };
  }, []);

  const handleScriptReady = () => {
    if (!window.BpmnJS || !containerRef.current) {
      setStatus('bpmn-js 초기화에 실패했습니다.');
      return;
    }

    viewerRef.current = new window.BpmnJS({
      container: containerRef.current,
    });

    try {
      void loadSavedDiagram();
    } catch {
      setStatus('저장된 workflow를 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="page">
      <Script
        src="https://unpkg.com/bpmn-js@18.8.0/dist/bpmn-navigated-viewer.production.min.js"
        strategy="afterInteractive"
        onReady={handleScriptReady}
      />

      <section className="container workflow-home">
        <h1>저장된 Workflow 조회</h1>
        <p className="workflow-status">상태: {status}</p>

        <div className="workflow-actions">
          <button type="button" onClick={loadSavedDiagram}>
            저장본 새로고침
          </button>
          <Link href="/workflow/editor">편집 화면으로 이동</Link>
        </div>

        <div ref={containerRef} className="workflow-canvas" />
      </section>
    </main>
  );
}
