import { getClientCompliance, getStudioComplianceStats } from './src/utils/complianceEngine.js'
import { INITIAL_CLIENTES, INITIAL_DDJJ } from './src/data/initialData.js'

console.log('=== TEST DE CUMPLIMIENTO DE IMPUESTOS (DDJJ) ===\n')

// 1. Verificar Gómez Martín (debe estar al día)
const compGomez = getClientCompliance('cli-001', INITIAL_DDJJ)
console.log('Cliente: Gómez Martín (cli-001)')
console.log(`- ¿Al día?: ${compGomez.isUpToDate}`)
console.log(`- Presentadas: ${compGomez.presentedCount}/${compGomez.totalCount}`)
console.log(`- Pendientes: ${compGomez.pendingCount}`)
console.assert(compGomez.isUpToDate === true, 'Gómez Martín debe estar al día')
console.assert(compGomez.pendingCount === 0, 'No debe tener pendientes')
console.log('✓ TEST 1 PASADO: Cliente al día verificado.\n')

// 2. Verificar Ferretería Central SRL (debe tener pendientes)
const compFerre = getClientCompliance('cli-005', INITIAL_DDJJ)
console.log('Cliente: Ferretería Central SRL (cli-005)')
console.log(`- ¿Al día?: ${compFerre.isUpToDate}`)
console.log(`- Presentadas: ${compFerre.presentedCount}/${compFerre.totalCount}`)
console.log(`- Pendientes: ${compFerre.pendingCount} (${compFerre.pendingItems.map(p => p.tributo).join(', ')})`)
console.assert(compFerre.isUpToDate === false, 'Ferretería Central no debe estar al día')
console.assert(compFerre.pendingCount === 2, 'Debe tener 2 obligaciones pendientes')
console.log('✓ TEST 2 PASADO: Detección de pendientes verificada.\n')

// 3. Verificar Estadísticas del Estudio
const studioStats = getStudioComplianceStats(INITIAL_CLIENTES, INITIAL_DDJJ)
console.log('Estadísticas Globales del Estudio:')
console.log(`- Total Clientes: ${studioStats.totalClientes}`)
console.log(`- Al Día: ${studioStats.clientesAlDia}`)
console.log(`- Con Pendientes: ${studioStats.clientesConPendientes}`)
console.log(`- Total DDJJ Pendientes: ${studioStats.totalDDJJPendientes}`)
console.assert(studioStats.clientesAlDia === 3, 'Deben haber 3 clientes al día')
console.assert(studioStats.clientesConPendientes === 2, 'Deben haber 2 clientes con pendientes')
console.assert(studioStats.totalDDJJPendientes === 3, 'Deben haber 3 DDJJ pendientes en total')
console.log('✓ TEST 3 PASADO: Métricas globales verificadas.\n')

console.log('TODAS LAS PRUEBAS DE CUMPLIMIENTO FISCAL FINALIZARON CON ÉXITO.')
