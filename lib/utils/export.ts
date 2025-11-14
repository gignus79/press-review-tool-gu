import type { SearchResult, ExportFormat } from '../types/database'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'

export function exportResults(
  results: SearchResult[], 
  format: ExportFormat, 
  filename: string = 'press-review-export'
) {
  switch (format) {
    case 'json':
      exportJSON(results, filename)
      break
    case 'excel':
      exportCSV(results, filename)
      break
    case 'pdf':
      exportPDF(results, filename)
      break
  }
}

function exportJSON(results: SearchResult[], filename: string) {
  const jsonData = JSON.stringify(results, null, 2)
  downloadFile(jsonData, `${filename}.json`, 'application/json')
}

function exportCSV(results: SearchResult[], filename: string) {
  const data = results.map(result => ({
    Title: result.title,
    Source: result.source,
    'Publish Date': new Date(result.publishDate).toLocaleDateString(),
    'Content Type': result.contentType,
    Sentiment: result.analysis?.sentiment || 'N/A',
    'Relevance Score': result.analysis?.relevanceScore || 'N/A',
    Authority: result.analysis?.authority || 'N/A',
    Themes: result.analysis?.themes.join(', ') || 'N/A',
    URL: result.url,
    Snippet: result.snippet
  }))

  const csv = Papa.unparse(data)
  downloadFile(csv, `${filename}.csv`, 'text/csv')
}

function exportPDF(results: SearchResult[], filename: string) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(18)
  doc.text('Press Review - Search Results', 14, 22)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
  
  // Table data with links
  const tableData = results.map((result, index) => [
    index + 1,
    result.title.length > 50 ? result.title.substring(0, 47) + '...' : result.title,
    result.source,
    new Date(result.publishDate).toLocaleDateString(),
    result.analysis?.sentiment || 'N/A',
    result.analysis?.relevanceScore ? `${result.analysis.relevanceScore}%` : 'N/A',
    'View' // Link column
  ])
  
  autoTable(doc, {
    head: [['#', 'Title', 'Source', 'Date', 'Sentiment', 'Relevance', 'Link']],
    body: tableData,
    startY: 35,
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: { 
      fillColor: [45, 15, 270], // Primary indigo color (approximate RGB)
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      6: { cellWidth: 20 } // Link column width
    }
  })
  
  // Add clickable links for each result
  const finalY = (doc as any).lastAutoTable.finalY || 35
  let currentY = finalY + 10
  
  results.forEach((result, index) => {
    if (currentY < 280) { // Before page end
      doc.setTextColor(45, 15, 270) // Primary blue
      doc.textWithLink('View Article', 180, currentY, { url: result.url })
      currentY += 7
    }
  })
  
  // Add summary page if multiple pages
  if (results.length > 0) {
    doc.addPage()
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Summary', 14, 20)
    
    const positive = results.filter(r => r.analysis?.sentiment === 'positive').length
    const negative = results.filter(r => r.analysis?.sentiment === 'negative').length
    const neutral = results.filter(r => r.analysis?.sentiment === 'neutral').length
    
    doc.setFontSize(12)
    doc.text(`Total Results: ${results.length}`, 14, 35)
    doc.text(`Positive: ${positive}`, 14, 45)
    doc.text(`Negative: ${negative}`, 14, 55)
    doc.text(`Neutral: ${neutral}`, 14, 65)
  }
  
  doc.save(`${filename}.pdf`)
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
