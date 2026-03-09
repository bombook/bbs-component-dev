'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'workflow:bpmn-xml';

const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Review Request">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="Done">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="260" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="412" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="209" y="120" />
        <di:waypoint x="260" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="412" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

declare global {
  interface Window {
    BpmnJS?: any;
  }
}

export default function WorkflowEditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<any>(null);
  const [status, setStatus] = useState('bpmn-js 스크립트 로딩 중...');

  const loadDiagram = async () => {
    if (!modelerRef.current) {
      return;
    }

    const savedXml = localStorage.getItem(STORAGE_KEY);
    const xml = savedXml ?? DEFAULT_BPMN_XML;
    await modelerRef.current.importXML(xml);
    const canvas = modelerRef.current.get('canvas');
    canvas.zoom('fit-viewport');
    setStatus(savedXml ? '저장된 workflow를 불러왔습니다.' : '기본 workflow를 불러왔습니다.');
  };

  const handleSave = async () => {
    if (!modelerRef.current) {
      return;
    }

    const result = await modelerRef.current.saveXML({ format: true });
    localStorage.setItem(STORAGE_KEY, result.xml);
    setStatus('workflow를 localStorage에 저장했습니다. 조회 화면에서 확인하세요.');
  };

  useEffect(() => {
    return () => {
      modelerRef.current?.destroy?.();
    };
  }, []);

  const handleScriptReady = () => {
    if (!window.BpmnJS || !containerRef.current) {
      setStatus('bpmn-js 초기화에 실패했습니다.');
      return;
    }

    modelerRef.current = new window.BpmnJS({
      container: containerRef.current,
      keyboard: {
        bindTo: window,
      },
    });

    try {
      void loadDiagram();
    } catch {
      setStatus('다이어그램 로딩 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="page">
      <Script
        src="https://unpkg.com/bpmn-js@18.8.0/dist/bpmn-modeler.production.min.js"
        strategy="afterInteractive"
        onReady={handleScriptReady}
      />

      <section className="container workflow-home">
        <h1>Workflow 편집</h1>
        <p className="workflow-status">상태: {status}</p>

        <div className="workflow-actions">
          <button type="button" onClick={handleSave}>
            저장
          </button>
          <button type="button" onClick={loadDiagram}>
            다시 불러오기
          </button>
          <Link href="/workflow/viewer">조회 화면으로 이동</Link>
        </div>

        <div ref={containerRef} className="workflow-canvas" />
      </section>
    </main>
  );
}
