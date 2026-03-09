import Link from 'next/link';

export default function WorkflowHomePage() {
  return (
    <main className="page">
      <section className="container workflow-home">
        <h1>BPMN Workflow 샘플</h1>
        <p>
          bpmn-js를 활용해 workflow를 편집하고 저장한 뒤, 별도 화면에서 조회하는 예제입니다.
          저장 데이터는 브라우저 localStorage에 보관됩니다.
        </p>

        <div className="workflow-links">
          <Link className="workflow-link" href="/workflow/editor">
            Workflow 편집 화면 열기
          </Link>
          <Link className="workflow-link" href="/workflow/viewer">
            저장된 Workflow 조회 화면 열기
          </Link>
        </div>
      </section>
    </main>
  );
}
