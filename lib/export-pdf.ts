export async function exportToPDF(
  htmlContent: string,
  filename = "proposal.pdf",
  options?: {
    margin?: number
    format?: string
    orientation?: string
  },
) {
  try {
    const html2pdf = (await import("html2pdf.js")).default

    const element = document.createElement("div")
    element.innerHTML = htmlContent
    element.style.padding = "20px"
    element.style.fontFamily = "system-ui, -apple-system, sans-serif"
    element.style.lineHeight = "1.6"
    element.style.color = "#333333"
    element.style.backgroundColor = "#ffffff"
    
    // Override CSS custom properties with fallback colors
    const style = document.createElement('style')
    style.textContent = `
      * {
        color: #333333 !important;
        background-color: transparent !important;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #1a1a1a !important;
      }
      table {
        border-color: #e5e5e5 !important;
      }
      th, td {
        border-color: #e5e5e5 !important;
        background-color: transparent !important;
      }
      th {
        background-color: #f5f5f5 !important;
      }
    `
    element.appendChild(style)

    const opt = {
      margin: options?.margin ?? 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        ignoreElements: (element: Element) => {
          return element.tagName === 'STYLE' && element.textContent?.includes('oklch')
        }
      },
      jsPDF: {
        orientation: (options?.orientation as any) ?? "portrait",
        unit: "mm",
        format: options?.format ?? "a4",
      },
    }

    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error("PDF export failed:", error)
    alert("Failed to export PDF. Please check your content and try again.")
  }
}
