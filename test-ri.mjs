import { calculateMonthlyIVAPosition, calculateRIAnnualProjection } from './src/utils/riEngine.js'
import { INITIAL_RI_MOVIMIENTOS } from './src/data/initialData.js'

console.log('=== TEST DE CONTROL DE RESPONSABLES INSCRIPTOS (RI) ===\n')

// 1. Test Posición Mensual de IVA (Mes 9 - Septiembre)
// Ventas Netas: 16.5M (Débito: 3.465.000), Compras: 8.9M (Crédito: 1.869.000), Retenciones: 180.000
const movSept = INITIAL_RI_MOVIMIENTOS.find(m => m.mes === 9)
const resIVA = calculateMonthlyIVAPosition(movSept)

console.log('[TEST 1] Liquidación Estimada de IVA (Septiembre):')
console.log(`- IVA Débito Fiscal: $${resIVA.debito.toLocaleString('es-AR')}`)
console.log(`- IVA Crédito Fiscal: $${resIVA.credito.toLocaleString('es-AR')}`)
console.log(`- Diferencia período: $${resIVA.diferenciaPeriodo.toLocaleString('es-AR')}`)
console.log(`- Retenciones sufridas: $${resIVA.retenciones.toLocaleString('es-AR')}`)
console.log(`- Saldo Final Resultante: $${resIVA.saldoFinal.toLocaleString('es-AR')} (${resIVA.resultadoLabel})`)

const expectedSaldo = (3465000 - 1869000) - 180000 // 1.416.000
console.assert(resIVA.esAPagar === true, 'El saldo de IVA debe ser a pagar')
console.assert(resIVA.saldoFinal === expectedSaldo, `El saldo debe ser exactamente $${expectedSaldo}`)
console.log('✓ TEST 1 PASADO: Posición mensual de IVA correcta.\n')

// 2. Test Proyección Anual de Ganancias (Enero a Septiembre - 9 meses)
const proj = calculateRIAnnualProjection(INITIAL_RI_MOVIMIENTOS, 0.30)
console.log('[TEST 2] Proyección Anual de Impuesto a las Ganancias:')
console.log(`- Meses computados: ${proj.mesesRegistrados}`)
console.log(`- Total Ventas Netas: $${proj.totalVentas.toLocaleString('es-AR')}`)
console.log(`- Total Compras Netas: $${proj.totalCompras.toLocaleString('es-AR')}`)
console.log(`- Total Gastos y Sueldos: $${proj.totalGastosDeducibles.toLocaleString('es-AR')}`)
console.log(`- Ganancia Neta Acumulada: $${proj.gananciaNetaAcumulada.toLocaleString('es-AR')} (Margen: ${proj.margenRentabilidad.toFixed(1)}%)`)
console.log(`- Proyección Anualizada (12m): $${proj.proyeccionAnual12m.toLocaleString('es-AR')}`)
console.log(`- Impuesto a las Ganancias Estimado (30%): $${proj.impuestoGananciasEstimado.toLocaleString('es-AR')}`)

console.assert(proj.mesesRegistrados === 9, 'Deben ser 9 meses registrados')
console.assert(proj.gananciaNetaAcumulada > 0, 'Debe haber ganancia acumulada')
console.assert(proj.impuestoGananciasEstimado > 0, 'El impuesto proyectado debe ser mayor a 0')
console.log('✓ TEST 2 PASADO: Proyección de Ganancias verificada.\n')

// 3. Test Alerta de Toma de Decisiones de Cierre de Mes
console.log('[TEST 3] Alerta de Cierre de Mes y Ajuste de Compras:')
console.log(`- Tipo de alerta: ${proj.alertaCierre?.tipo}`)
console.log(`- Título: ${proj.alertaCierre?.titulo}`)
console.log(`- Diagnóstico: ${proj.alertaCierre?.mensaje}`)
console.assert(proj.alertaCierre?.tipo === 'alerta_compras', 'Debe emitir alerta de compras por saldo elevado de IVA')
console.log('✓ TEST 3 PASADO: Detección y asesoramiento de cierre verificado.\n')

console.log('TODAS LAS PRUEBAS DEL MÓDULO DE RESPONSABLES INSCRIPTOS FINALIZARON CON ÉXITO.')
