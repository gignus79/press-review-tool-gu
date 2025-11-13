import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import type { SearchResult, ExportFormat } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
  
  // Title
  doc.setFontSize(18)
  doc.text('Press Review Export', 14, 20)
  
  // Date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
  doc.text(`Total Results: ${results.length}`, 14, 34)
  
  // Table
  const tableData = results.map(result => [
    result.title.substring(0, 50) + (result.title.length > 50 ? '...' : ''),
    result.source,
    new Date(result.publishDate).toLocaleDateString(),
    result.contentType,
    result.analysis?.sentiment || 'N/A',
    result.analysis?.relevanceScore?.toString() || 'N/A'
  ])

  autoTable(doc, {
    head: [['Title', 'Source', 'Date', 'Type', 'Sentiment', 'Score']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] }, // indigo
  })
  
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
