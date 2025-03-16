import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function GeneratePDF({ bpHistory }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Blood Pressure Report", 14, 10);
    
    autoTable(doc, {
      head: [["Date", "Systolic", "Diastolic", "Pulse"]],
      body: bpHistory.map(bp => [
        new Date(bp.createdAt).toLocaleDateString(),
        bp.systolic,
        bp.diastolic,
        bp.pulse,
      ]),
    });

    doc.save("bp_report.pdf");
  };

  return <button className="btn btn-danger" onClick={generatePDF}>Download Report</button>;
}

export default GeneratePDF;