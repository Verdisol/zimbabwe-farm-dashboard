'use client'

import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  targetId?: string
  label?: string
}

export default function ExportButton({
  targetId = 'export-area',
  label = 'Export PDF',
}: Props) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)

    try {
      // Dynamically import heavy libraries only when needed
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const target = document.getElementById(targetId)
      if (!target) {
        toast.error('Nothing to export', {
          description: 'The content area could not be found.',
        })
        setExporting(false)
        return
      }

      toast.info('Preparing PDF...', {
        description: 'Capturing dashboard content',
      })

      // Capture the target as a canvas with high pixel ratio
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f0f9f4',
        logging: false,
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')

      // A4 portrait: 210 x 297 mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = 210
      const pageHeight = 297
      const headerHeight = 32
      const margin = 8

      // ---------- Header bar (green gradient look) ----------
      pdf.setFillColor(22, 128, 60) // #16803c
      pdf.rect(0, 0, pageWidth, headerHeight, 'F')

      // Accent stripe
      pdf.setFillColor(13, 90, 41) // #0d5a29
      pdf.rect(0, headerHeight - 3, pageWidth, 3, 'F')

      // Title
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.text('Zimbabwe Farm Dashboard', margin, 15)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text('Climate-Smart Agriculture Report', margin, 22)

      // Date on the right
      const now = new Date()
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      const timeStr = now.toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit',
      })
      pdf.setFontSize(9)
      pdf.text(`Generated: ${dateStr} ${timeStr}`, pageWidth - margin, 15, {
        align: 'right',
      })

      // District from localStorage (best effort)
      let district = '—'
      try {
        const raw = localStorage.getItem('farmerLocation')
        if (raw) {
          const parsed = JSON.parse(raw)
          district = parsed?.name || '—'
        }
      } catch {
        /* ignore */
      }
      pdf.text(`Location: ${district}`, pageWidth - margin, 22, { align: 'right' })

      // ---------- Content area ----------
      const contentTop = headerHeight + 6
      const contentWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * contentWidth) / canvas.width

      // If image fits on this page, place it. Otherwise, split into pages.
      let remainingHeight = imgHeight
      let yPosition = contentTop
      let pageIndex = 0

      while (remainingHeight > 0) {
        const availableHeight = pageHeight - yPosition - margin

        if (remainingHeight <= availableHeight) {
          // Whole image fits
          pdf.addImage(
            imgData,
            'PNG',
            margin,
            yPosition,
            contentWidth,
            remainingHeight,
            undefined,
            'FAST'
          )
          break
        } else {
          // Slice off the top of the image for this page
          const sliceHeight = availableHeight
          const canvasSliceHeight = (sliceHeight / imgHeight) * canvas.height
          const canvasYOffset = (pageIndex * availableHeight / imgHeight) * canvas.height

          const slice = document.createElement('canvas')
          slice.width = canvas.width
          slice.height = canvasSliceHeight
          const ctx = slice.getContext('2d')
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              canvasYOffset,
              canvas.width,
              canvasSliceHeight,
              0,
              0,
              canvas.width,
              canvasSliceHeight
            )
            const sliceData = slice.toDataURL('image/png')
            pdf.addImage(
              sliceData,
              'PNG',
              margin,
              yPosition,
              contentWidth,
              sliceHeight,
              undefined,
              'FAST'
            )
          }

          remainingHeight -= sliceHeight
          pageIndex += 1

          if (remainingHeight > 0) {
            pdf.addPage()
            yPosition = margin
          }
        }
      }

      // ---------- Footer on every page ----------
      const pageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFillColor(240, 249, 244) // #f0f9f4
        pdf.rect(0, pageHeight - 12, pageWidth, 12, 'F')

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(100, 116, 139)
        pdf.text(
          'Zimbabwe Farm Dashboard — Dissertation Project',
          margin,
          pageHeight - 6
        )
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 6, {
          align: 'right',
        })
      }

      // ---------- Save ----------
      const fileDate = now.toISOString().slice(0, 10)
      pdf.save(`zimbabwe-farm-dashboard-${fileDate}.pdf`)

      toast.success('PDF exported! 📄', {
        description: 'Check your downloads folder.',
      })
    } catch (err: any) {
      console.error(err)
      toast.error('Export failed', {
        description: err?.message || 'Please try again.',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        background: exporting
          ? 'rgba(148,163,184,0.8)'
          : 'linear-gradient(135deg, #16803c, #0d5a29)',
        color: 'white',
        border: '1px solid rgba(0,255,136,0.45)',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: exporting ? 'not-allowed' : 'pointer',
        boxShadow: '0 0 15px rgba(0,255,136,0.35)',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        if (!exporting) {
          e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.65)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!exporting) {
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.35)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      <span style={{ fontSize: '16px' }}>{exporting ? '⏳' : '📄'}</span>
      {exporting ? 'Generating PDF...' : label}
    </button>
  )
}
