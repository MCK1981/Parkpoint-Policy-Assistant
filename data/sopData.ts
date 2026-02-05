
import { DepartmentGroup, SOP } from '../types';

export const SOP_DATA: DepartmentGroup[] = [
  {
    name: 'Human Resources',
    icon: 'fa-users',
    sops: [
      {
        id: 'SOP-HR-01',
        title: 'Recruitment & Onboarding',
        department: 'Human Resources',
        sections: [
          { title: 'Purpose', content: 'To ensure that ParkPoint attracts and retains the highest quality of talent through a structured, transparent, and fair recruitment process.' },
          { title: 'Scope', content: 'Applies to all permanent, temporary, and outsourced staff recruitment across all regions of ParkPoint operation.' },
          { title: 'Requisition Process', content: '1. Identification of Vacancy: The Department Head identifies the need for a new role.\n2. MRF Submission: A Manpower Requisition Form (MRF) must be completed and signed by the Department Head and Finance.\n3. Budget Verification: Finance confirms if the position is within the approved annual budget.' },
          { title: 'Sourcing & Screening', content: 'HR will post the job internally for 48 hours before external sourcing. Screening involves automated resume parsing followed by a 15-minute HR discovery call.' },
          { title: 'Interviewing Tiers', content: 'Level 1: Technical Interview with Direct Supervisor.\nLevel 2: Behavioral Interview with HR Manager.\nLevel 3: Final Approval Interview with General Manager (GM).' },
          { title: 'Offer & Contract', content: 'Successful candidates will receive a Conditional Offer Letter. Upon reference check completion, the formal Employment Contract is issued.' }
        ]
      },
      {
        id: 'SOP-HR-02',
        title: 'Leave & Attendance Policy',
        department: 'Human Resources',
        sections: [
          { title: 'Core Objectives', content: 'To maintain operational efficiency while ensuring employees receive their statutory and wellness-related time off.' },
          { title: 'Annual Leave Accrual', content: 'All employees accrue annual leave at a rate of 2.5 days per completed calendar month of service, totaling 30 days per annum.' },
          { title: 'Application Procedure', content: 'Leave requests must be submitted via the ERP portal at least 14 days in advance for leave exceeding 3 days. Approval is subject to operational requirements.' },
          { title: 'Sick Leave', content: 'Medical certificates are mandatory for any sick leave exceeding 1 day. Fraudulent claims will result in immediate disciplinary action under SOP-HR-05.' }
        ]
      }
    ]
  },
  {
    name: 'Finance',
    icon: 'fa-money-bill-transfer',
    sops: [
      {
        id: 'SOP-FIN-01',
        title: 'Petty Cash Management',
        department: 'Finance',
        sections: [
          { title: 'Overview', content: 'Controls the disbursement of small-value emergency cash payments to avoid the administrative burden of formal procurement.' },
          { title: 'Custodian Responsibility', content: 'The Finance Officer is the primary custodian. The float must be stored in a dual-lock fireproof safe.' },
          { title: 'Expenditure Limits', content: 'Maximum single transaction: BD 50.\nMaximum monthly branch limit: BD 500.\nReplenishment occurs when 70% of the float is exhausted.' },
          { title: 'Prohibited Uses', content: 'Petty cash shall NOT be used for: 1. Salary advances, 2. Personal loans, 3. Cashing personal checks, 4. Regular inventory procurement.' }
        ]
      }
    ]
  },
  {
    name: 'Operations',
    icon: 'fa-car',
    sops: [
      {
        id: 'SOP-OPS-01',
        title: 'Lost Ticket Procedure',
        department: 'Operations',
        sections: [
          { title: 'Policy Statement', content: 'ParkPoint aims to resolve lost ticket issues fairly for the customer while preventing revenue leakage.' },
          { title: 'Immediate Action Plan', content: '1. Request License Plate Number from the client.\n2. Execute LPR (License Plate Recognition) search in the PMS system.\n3. If found, charge based on actual entry time.' },
          { title: 'Secondary Verification', content: 'If LPR fails: 1. Check Shift Overnight Report for entry logs.\n2. Review CCTV if the stay is suspected to be long-term.\n3. Request customer to verify identity via Mobile OTP registered in ParkPoint app.' },
          { title: 'Standard Penalty', content: 'If no entry proof is available, a standard "Lost Ticket Fee" (BD 10 or daily max) is applied.' }
        ]
      },
      {
        id: 'SOP-OPS-10',
        title: 'Valet Uniform & Grooming',
        department: 'Operations',
        sections: [
          { title: 'Brand Identity', content: 'Uniforms are a critical touchpoint of our premium service. Compliance is non-negotiable.' },
          { title: 'Uniform Components', content: '• Branded Polo Shirt (Tucked in)\n• Navy Trousers (Creased)\n• Reflective Safety Vest (Night Shift)\n• Black Polished Shoes\n• Branded ID Badge (Visible on chest)' },
          { title: 'Grooming Standards', content: 'Hair must be neatly trimmed. Facial hair must be well-groomed or clean-shaven. Tattoos must be covered by sleeves where possible.' }
        ]
      }
    ]
  },
  {
    name: 'Audit & Compliance',
    icon: 'fa-clipboard-check',
    sops: [
      {
        id: 'SOP-AUD-04',
        title: 'Internal Audit Controls',
        department: 'Audit',
        sections: [
          { title: 'Framework', content: 'Establishes the "Three Lines of Defense" model for ParkPoint corporate governance.' },
          { title: 'Audit Cycle', content: 'Operational units are subject to a full audit every 90 days. High-risk locations (Airport/Malls) are audited monthly.' },
          { title: 'Reporting', content: 'Draft reports are shared with Dept Heads within 48 hours. Final reports are submitted to the Board Audit Committee monthly.' }
        ]
      }
    ]
  },
  {
    name: 'Revenue Reconciliation',
    icon: 'fa-chart-pie',
    sops: [
      {
        id: 'SOP-REV-01',
        title: 'Daily Revenue Matching',
        department: 'Revenue',
        sections: [
          { title: 'Methodology', content: 'Ensures that every car processed in the system is financially accounted for in the bank accounts.' },
          { title: '4-Step Verification', content: '1. PMS System Totals vs Shift Close Reports.\n2. Physical Cash Count vs Cash Collection Slips.\n3. Credit Card/App Payments vs Gateway Provider Statements.\n4. Total Consolidated Revenue vs Bank Deposit Slips.' },
          { title: 'Variance Management', content: 'Any variance > 1.0% or BD 20 (whichever is lower) requires an immediate Incident Report (IR) and investigation by the Audit team.' }
        ]
      }
    ]
  }
];

export const findSOPById = (id: string): SOP | undefined => {
  if (!id) return undefined;
  // Handle cases where ID is just the code or "Code - Title"
  const normalizedId = id.split(' ')[0].trim().toUpperCase(); 
  for (const group of SOP_DATA) {
    const sop = group.sops.find(s => s.id === normalizedId || s.title.toUpperCase().includes(normalizedId));
    if (sop) return sop;
  }
  return undefined;
};
