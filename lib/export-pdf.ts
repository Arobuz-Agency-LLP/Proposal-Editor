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
    // Show loading indicator
    const loadingMessage = document.createElement('div')
    loadingMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px 40px;
      border-radius: 8px;
      z-index: 10000;
      font-family: system-ui, sans-serif;
    `
    loadingMessage.textContent = 'Generating PDF...'
    document.body.appendChild(loadingMessage)

    // Dynamically import html2pdf.js
    const html2pdf = (await import("html2pdf.js")).default

    // Create a container element for the PDF
    const element = document.createElement("div")
    element.style.cssText = `
      padding: 40px;
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #333333;
      background-color: #ffffff;
      max-width: 800px;
      margin: 0 auto;
    `
    
    // Clean and prepare HTML content
    let cleanedContent = htmlContent
    
    // Remove any script tags
    cleanedContent = cleanedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    
    // Remove style tags with oklch colors (they cause issues)
    cleanedContent = cleanedContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      return match.includes('oklch') ? '' : match
    })
    
    element.innerHTML = cleanedContent
    
    // Add comprehensive styles for PDF
    const style = document.createElement('style')
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body, div {
        color: #333333 !important;
        background-color: #ffffff !important;
      }
      
      h1 {
        font-size: 32px !important;
        font-weight: bold !important;
        color: #1a1a1a !important;
        margin: 20px 0 15px 0 !important;
        line-height: 1.2 !important;
      }
      
      h2 {
        font-size: 24px !important;
        font-weight: bold !important;
        color: #1a1a1a !important;
        margin: 18px 0 12px 0 !important;
        line-height: 1.3 !important;
      }
      
      h3 {
        font-size: 20px !important;
        font-weight: bold !important;
        color: #1a1a1a !important;
        margin: 16px 0 10px 0 !important;
        line-height: 1.3 !important;
      }
      
      h4, h5, h6 {
        font-size: 16px !important;
        font-weight: bold !important;
        color: #1a1a1a !important;
        margin: 14px 0 8px 0 !important;
      }
      
      p {
        margin: 12px 0 !important;
        line-height: 1.6 !important;
        color: #333333 !important;
      }
      
      ul, ol {
        margin: 12px 0 12px 30px !important;
        padding-left: 20px !important;
      }
      
      li {
        margin: 6px 0 !important;
        line-height: 1.6 !important;
      }
      
      table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 20px 0 !important;
        border: 1px solid #e5e5e5 !important;
        table-layout: auto !important;
      }
      
      th, td {
        border: 1px solid #e5e5e5 !important;
        padding: 10px 12px !important;
        text-align: left !important;
        vertical-align: top !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
      }
      
      th {
        background-color: #f5f5f5 !important;
        font-weight: bold !important;
        color: #1a1a1a !important;
      }
      
      td {
        background-color: #ffffff !important;
        color: #333333 !important;
      }
      
      a {
        color: #0066cc !important;
        text-decoration: underline !important;
      }
      
      img {
        max-width: 100% !important;
        height: auto !important;
        margin: 15px 0 !important;
        display: block !important;
      }
      
      blockquote {
        border-left: 4px solid #0066cc !important;
        padding-left: 15px !important;
        margin: 15px 0 !important;
        font-style: italic !important;
        color: #666666 !important;
      }
      
      code {
        background-color: #f5f5f5 !important;
        padding: 2px 6px !important;
        border-radius: 3px !important;
        font-family: 'Courier New', monospace !important;
        font-size: 0.9em !important;
      }
      
      pre {
        background-color: #f5f5f5 !important;
        padding: 15px !important;
        border-radius: 5px !important;
        overflow-x: auto !important;
        margin: 15px 0 !important;
      }
      
      pre code {
        background-color: transparent !important;
        padding: 0 !important;
      }
      
      hr {
        border: none !important;
        border-top: 1px solid #e5e5e5 !important;
        margin: 20px 0 !important;
      }
      
      /* Page break styling for PDF */
      div[data-type="page-break"],
      .page-break {
        page-break-after: always !important;
        break-after: page !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        visibility: hidden !important;
        display: none !important;
      }
      
      div[data-type="page-break"]::before,
      div[data-type="page-break"]::after,
      .page-break::before,
      .page-break::after {
        display: none !important;
        content: none !important;
      }
      
      /* Placeholder styling */
      span[data-placeholder-key] {
        background-color: #e8f4f8 !important;
        color: #0066cc !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        font-weight: 500 !important;
      }
    `
    element.appendChild(style)
    
    // Append to body temporarily (needed for html2canvas)
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.top = '0'
    document.body.appendChild(element)

    // Wait for images to load
    const images = element.querySelectorAll('img')
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve, reject) => {
        if (img.complete) {
          resolve(img)
        } else {
          img.onload = () => resolve(img)
          img.onerror = () => resolve(img) // Continue even if image fails
          // Timeout after 5 seconds
          setTimeout(() => resolve(img), 5000)
        }
      })
    })
    
    await Promise.all(imagePromises)

    // Configure PDF options
    const opt = {
      margin: options?.margin ?? [15, 15, 15, 15],
      filename: filename,
      image: { 
        type: "jpeg", 
        quality: 0.95 
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 800,
        windowHeight: element.scrollHeight,
        ignoreElements: (el: Element) => {
          // Ignore style tags with problematic CSS
          if (el.tagName === 'STYLE') {
            const text = el.textContent || ''
            return text.includes('oklch') || text.includes('backdrop-filter')
          }
          return false
        },
        onclone: (clonedDoc: Document) => {
          // Ensure all styles are applied in cloned document
          const clonedElement = clonedDoc.body.querySelector('div')
          if (clonedElement) {
            clonedElement.style.cssText = element.style.cssText
          }
        }
      },
      jsPDF: {
        orientation: (options?.orientation as any) ?? "portrait",
        unit: "mm",
        format: options?.format ?? "a4",
        compress: true,
      },
    }

    // Generate and save PDF
    await html2pdf().set(opt).from(element).save()
    
    // Clean up
    document.body.removeChild(element)
    document.body.removeChild(loadingMessage)
    
  } catch (error) {
    console.error("PDF export failed:", error)
    
    // Remove loading message if it exists
    const loadingMsg = document.querySelector('div[style*="position: fixed"]')
    if (loadingMsg) {
      document.body.removeChild(loadingMsg)
    }
    
    // Show user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    alert(`Failed to export PDF: ${errorMessage}\n\nPlease try again or check the browser console for more details.`)
  }
}
