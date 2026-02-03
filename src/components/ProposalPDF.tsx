import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts if needed, but for server side it might be tricky without absolute paths.
// I'll stick to standard fonts for now for reliability.

const styles = StyleSheet.create({
    page: {
        padding: 60,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 20,
    },
    label: {
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
        color: '#666666',
    },
    title: {
        fontSize: 32,
        marginBottom: 10,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
        paddingBottom: 4,
    },
    text: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#333333',
    },
    metaGrid: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    metaItem: {
        flex: 1,
    },
    investmentBox: {
        backgroundColor: '#F9F9F9',
        padding: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        left: 60,
        right: 60,
        textAlign: 'center',
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.3,
    }
})

type ProposalData = {
    client_name: string
    service_description: string
    project_value: string
    deadline: string
    payment_conditions: string
    date: string
}

export const ProposalPDF = ({ data }: { data: ProposalData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.label}>Proposta Comercial</Text>
                <Text style={styles.title}>{data.service_description}</Text>
            </View>

            <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Para</Text>
                    <Text style={{ fontSize: 16 }}>{data.client_name}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Data</Text>
                    <Text style={{ fontSize: 16 }}>{data.date}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Escopo do Trabalho</Text>
                <Text style={styles.text}>
                    Esta proposta formaliza a prestação de serviços de {data.service_description} para {data.client_name}.
                    O trabalho será executado com foco em excelência técnica e cumprimento rigoroso dos objetivos acordados.
                </Text>
            </View>

            <View style={styles.investmentBox}>
                <View>
                    <Text style={styles.label}>Investimento Total</Text>
                    <Text style={styles.price}>{data.project_value}</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                    <Text style={styles.label}>Prazo de Entrega</Text>
                    <Text style={{ fontSize: 14 }}>{data.deadline}</Text>
                </View>
            </View>

            <View style={[styles.section, { marginTop: 30 }]}>
                <Text style={styles.sectionTitle}>Condições de Pagamento</Text>
                <Text style={styles.text}>{data.payment_conditions}</Text>
            </View>

            <Text style={styles.footer}>Gerado via ProposeKit — Licença Premium</Text>
        </Page>
    </Document>
)
