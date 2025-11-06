'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { ColorChart } from './GemColorCard';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #9A1A63',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  badge: {
    backgroundColor: '#9A1A63',
    color: 'white',
    padding: '5 10',
    fontSize: 10,
    marginTop: 5,
    width: 'auto',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gradientBar: {
    height: 60,
    marginBottom: 10,
  },
  giaGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  giaItem: {
    flex: 1,
    marginRight: 10,
  },
  giaLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  giaValue: {
    fontSize: 12,
  },
  pleochroContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  pleochroItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  colorBox: {
    width: 60,
    height: 60,
    border: '2 solid #000',
    marginBottom: 5,
  },
  colorHex: {
    fontSize: 8,
    fontFamily: 'Courier',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTop: '1 solid #ccc',
    fontSize: 8,
    color: '#666',
  },
});

interface PDFExportProps {
  chart: ColorChart;
}

// PDF Document Component
const ColorChartPDF = ({ chart }: { chart: ColorChart }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{chart.name}</Text>
        {chart.origin && (
          <Text style={styles.subtitle}>{chart.origin}</Text>
        )}
        {chart.featured && (
          <View style={styles.badge}>
            <Text style={{ color: 'white' }}>Featured</Text>
          </View>
        )}
      </View>

      {/* Gradient */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farbverlauf</Text>
        <View style={styles.gradientBar}>
          {/* Gradient representation - simplified */}
          <View style={{ flexDirection: 'row', height: 60 }}>
            {chart.gradient.map((color, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  backgroundColor: color,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* GIA Data */}
      {chart.gia && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GIA-Daten</Text>
          <View style={styles.giaGrid}>
            {chart.gia.hue && (
              <View style={styles.giaItem}>
                <Text style={styles.giaLabel}>Hue</Text>
                <Text style={styles.giaValue}>{chart.gia.hue}</Text>
              </View>
            )}
            {chart.gia.tone && (
              <View style={styles.giaItem}>
                <Text style={styles.giaLabel}>Tone</Text>
                <Text style={styles.giaValue}>{chart.gia.tone}</Text>
              </View>
            )}
            {chart.gia.sat && (
              <View style={styles.giaItem}>
                <Text style={styles.giaLabel}>Saturation</Text>
                <Text style={styles.giaValue}>{chart.gia.sat}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Pleochroism */}
      {chart.pleochro && chart.pleochro.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pleochroismus</Text>
          <View style={styles.pleochroContainer}>
            {chart.pleochro.map((color, index) => (
              <View key={index} style={styles.pleochroItem}>
                <View style={[styles.colorBox, { backgroundColor: color }]} />
                <Text style={styles.colorHex}>{color}</Text>
                <Text style={{ fontSize: 8, marginTop: 2 }}>Richtung {index + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Additional Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weitere Informationen</Text>
        <Text style={{ marginBottom: 5 }}>
          <Text style={{ fontWeight: 'bold' }}>Lichtstandard: </Text>
          {chart.light}
        </Text>
        {chart.note && (
          <Text style={{ marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Notiz: </Text>
            {chart.note}
          </Text>
        )}
        {chart.description && (
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Beschreibung: </Text>
            {chart.description}
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>GemILike Farbtafeln - GIA-konforme Benennung</Text>
        <Text>
          Erstellt: {new Date(chart.createdAt).toLocaleDateString('de-DE')}
        </Text>
      </View>
    </Page>
  </Document>
);

export function PDFExport({ chart }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <PDFDownloadLink
      document={<ColorChartPDF chart={chart} />}
      fileName={`${chart.name.replace(/\s+/g, '-').toLowerCase()}-${chart.id}.pdf`}
      className="inline-block"
    >
      {({ loading }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={loading || isGenerating}
          className="flex items-center gap-2"
          onClick={() => setIsGenerating(true)}
        >
          {loading || isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          PDF
        </Button>
      )}
    </PDFDownloadLink>
  );
}

