
export interface Message {
  role: 'user' | 'model';
  content: string;
  isStepByStep?: boolean;
}

export interface FlowNode {
  id: string;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface SOPResponse {
  summary: string;
  roles: Array<{
    position: string;
    responsibility: string;
  }>;
  flowchart: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  references: string[];
  faqs: string[];
}

export interface SOP {
  id: string;
  title: string;
  department: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export interface DepartmentGroup {
  name: string;
  icon: string;
  sops: SOP[];
}
