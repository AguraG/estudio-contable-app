import { calculateClientStatus, getMobile12Months } from './src/utils/monotributoEngine.js'
import { INITIAL_ESCALAS } from './src/data/initialData.js'

console.log('=== TEST DE VERIFICACIÓN DE MOTOR DE MONOTRIBUTO ===\n')

// 1. Test de generación de 12 meses móviles (Corte Septiembre 2024)
const months = getMobile12Months(2024, 9)
console.log(`[TEST 1] Generación de 12 meses móviles (debe tener 12 elementos):`)
console.log(`- Primer mes: ${months[0].mes}/${months[0].anio} (esperado 10/2023)`)
console.log(`- Último mes: ${months[11].mes}/${months[11].anio} (esperado 9/2024)`)
console.assert(months.length === 12, 'Deben ser exactamente 12 meses')
console.assert(months[0].mes === 10 && months[0].anio === 2023, 'El primer mes debe ser Octubre 2023')
console.assert(months[11].mes === 9 && months[11].anio === 2024, 'El último mes debe ser Septiembre 2024')
console.log('✓ TEST 1 PASADO: Rango de 12 meses móviles correcto.\n')

// 2. Test Caso 🟢 VERDE (Holgado)
// Cliente Cat C (Tope $13.250.000), facturación total $8.000.000 (~60.3%)
const clientVerde = { id: 'test-1', razon_social: 'Cliente Verde', categoria_monotributo_actual: 'C' }
const billingsVerde = months.map(m => ({ cliente_id: 'test-1', anio: m.anio, mes: m.mes, monto_facturado: 8000000 / 12 }))
const resVerde = calculateClientStatus(clientVerde, billingsVerde, INITIAL_ESCALAS, 2024, 9)

console.log(`[TEST 2] Caso 🟢 Verde:`)
console.log(`- Total 12m: $${resVerde.total12m.toFixed(2)} vs Tope $${resVerde.topeActual}`)
console.log(`- Porcentaje consumido: ${resVerde.porcentajeConsumido.toFixed(2)}%`)
console.log(`- Estado: ${resVerde.status}`)
console.assert(resVerde.status === 'green', 'El estado debe ser green')
console.assert(resVerde.porcentajeConsumido < 85, 'Debe ser menor al 85%')
console.log('✓ TEST 2 PASADO: Semáforo Verde verificado.\n')

// 3. Test Caso 🟡 AMARILLO (Alerta de Proximidad 85% a 100%)
// Cliente Cat C (Tope $13.250.000), facturación total $12.000.000 (90.5%)
const clientAmarillo = { id: 'test-2', razon_social: 'Cliente Amarillo', categoria_monotributo_actual: 'C' }
const billingsAmarillo = months.map(m => ({ cliente_id: 'test-2', anio: m.anio, mes: m.mes, monto_facturado: 12000000 / 12 }))
const resAmarillo = calculateClientStatus(clientAmarillo, billingsAmarillo, INITIAL_ESCALAS, 2024, 9)

console.log(`[TEST 3] Caso 🟡 Amarillo:`)
console.log(`- Total 12m: $${resAmarillo.total12m.toFixed(2)} vs Tope $${resAmarillo.topeActual}`)
console.log(`- Porcentaje consumido: ${resAmarillo.porcentajeConsumido.toFixed(2)}%`)
console.log(`- Estado: ${resAmarillo.status}`)
console.assert(resAmarillo.status === 'yellow', 'El estado debe ser yellow')
console.assert(resAmarillo.porcentajeConsumido >= 85 && resAmarillo.porcentajeConsumido <= 100, 'Debe estar entre 85% y 100%')
console.log('✓ TEST 3 PASADO: Semáforo Amarillo verificado.\n')

// 4. Test Caso 🔴 ROJO (Excedido en categoría intermedia -> Recategorización)
// Cliente Cat B (Tope $9.450.000), facturación total $11.500.000 -> Debe sugerir Cat C
const clientRojo = { id: 'test-3', razon_social: 'Cliente Rojo', categoria_monotributo_actual: 'B' }
const billingsRojo = months.map(m => ({ cliente_id: 'test-3', anio: m.anio, mes: m.mes, monto_facturado: 11500000 / 12 }))
const resRojo = calculateClientStatus(clientRojo, billingsRojo, INITIAL_ESCALAS, 2024, 9)

console.log(`[TEST 4] Caso 🔴 Rojo (Recategorización):`)
console.log(`- Total 12m: $${resRojo.total12m.toFixed(2)} vs Tope Cat B $${resRojo.topeActual}`)
console.log(`- Estado: ${resRojo.status}`)
console.log(`- Categoría sugerida: Cat ${resRojo.suggestedCategory}`)
console.assert(resRojo.status === 'red', 'El estado debe ser red')
console.assert(resRojo.suggestedCategory === 'C', 'Debe sugerir pasar a Categoría C')
console.log('✓ TEST 4 PASADO: Semáforo Rojo y sugerencia de Cat C verificados.\n')

// 5. Test Caso 🔴 ROJO CRÍTICO (Exclusión a Responsable Inscripto)
// Cliente Cat K (Tope $68.000.000), facturación total $75.000.000
const clientExclusion = { id: 'test-4', razon_social: 'Cliente Exclusion', categoria_monotributo_actual: 'K' }
const billingsExclusion = months.map(m => ({ cliente_id: 'test-4', anio: m.anio, mes: m.mes, monto_facturado: 75000000 / 12 }))
const resExclusion = calculateClientStatus(clientExclusion, billingsExclusion, INITIAL_ESCALAS, 2024, 9)

console.log(`[TEST 5] Caso 🔴 Exclusión a Responsable Inscripto:`)
console.log(`- Total 12m: $${resExclusion.total12m.toFixed(2)} vs Tope Cat K $${resExclusion.topeActual}`)
console.log(`- Alerta de exclusión: ${resExclusion.exclusionRisk}`)
console.log(`- Categoría sugerida: ${resExclusion.suggestedCategory}`)
console.assert(resExclusion.status === 'red', 'El estado debe ser red')
console.assert(resExclusion.exclusionRisk === true, 'Debe activar riesgo de exclusión')
console.log('✓ TEST 5 PASADO: Detección de exclusión a RI verificada.\n')

console.log('TODAS LAS PRUEBAS MATEMÁTICAS Y TRIBUTARIAS FINALIZARON EXITOSAMENTE.')
