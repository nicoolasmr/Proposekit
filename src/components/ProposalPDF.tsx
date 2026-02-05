import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ProposalContent } from '@/lib/proposal-engine'

const styles = StyleSheet.create({
    page: {
        padding: 60,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.6,
        color: '#333333',
    },
    header: {
        marginBottom: 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    label: {
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
        color: '#666666',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontFamily: 'Helvetica-Bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#000000',
    },
    text: {
        marginBottom: 4,
        textAlign: 'justify',
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    bullet: {
        width: 10,
        fontSize: 14,
    },
    investmentBox: {
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#000000',
        marginTop: 10,
        marginBottom: 20,
    },
    price: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        marginTop: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 60,
        right: 60,
        textAlign: 'center',
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.3,
    }
})

export const ProposalPDF = ({ content, clientName }: { content: ProposalContent; clientName: string }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* 1. Header / Intro */}
            <View style={styles.header}>
                <Text style={styles.label}>Proposta Comercial</Text>
                <Text style={styles.title}>Plano de Trabalho para {clientName}</Text>
                <Text style={styles.text}>{content.introduction}</Text>
            </View>

            {/* 2. Contexto */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Contexto e Objetivo</Text>
                <Text style={styles.text}>{content.context}</Text>
            </View>

            {/* 3. Escopo */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Escopo do Projeto</Text>
                {content.scope.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.text}>{item}</Text>
                    </View>
                ))}
            </View>

            {/* 4. Não Incluso */}
            {content.outOfScope && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. O que não está incluso</Text>
                    <Text style={styles.text}>{content.outOfScope}</Text>
                </View>
            )}

            {/* 5. Operação */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{content.outOfScope ? '4' : '3'}. Operação e Comunicação</Text>
                <Text style={styles.text}>{content.operation}</Text>
            </View>

            {/* 6. Investimento */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{content.outOfScope ? '5' : '4'}. Investimento</Text>
                <View style={styles.investmentBox}>
                    <Text style={styles.text}>{content.investment}</Text>
                    {/* Extracting pure value from string logic or passing raw if needed, for now using the sentence */}
                </View>
            </View>

            {/* 7. Condições */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{content.outOfScope ? '6' : '5'}. Condições Comerciais</Text>
                <Text style={styles.text}>{content.commercialConditions}</Text>
            </View>

            {/* 8. Cronograma */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{content.outOfScope ? '7' : '6'}. Prazo Estimado</Text>
                <Text style={styles.text}>{content.timeline}</Text>
            </View>

            {/* 9. Próximos Passos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{content.outOfScope ? '8' : '7'}. Próximos Passos</Text>
                <Text style={styles.text}>{content.nextSteps}</Text>
            </View>

            <Text style={styles.footer}>Documento gerado automaticamente via ProposeKit</Text>
        </Page>
    </Document>
)
