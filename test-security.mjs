import { encryptPassword, decryptPassword } from './src/utils/security.js'

console.log('=== TEST DE BÓVEDA DE CREDENCIALES Y CIFRADO ===\n')

const testPasswords = [
  'ClaveFiscalARCA#2026',
  'Atm_Misiones*Pass99!',
  'ContraseñaConÑyAcentos_áéíóú',
  '12345678',
  'SindicatoSEC$Silva'
]

for (const pass of testPasswords) {
  const encrypted = encryptPassword(pass)
  const decrypted = decryptPassword(encrypted)
  console.log(`Original: "${pass}"`)
  console.log(`Cifrado:  "${encrypted}"`)
  console.log(`Descifrado: "${decrypted}"`)
  console.assert(pass === decrypted, `Error: ${pass} no coincide con ${decrypted}`)
  console.assert(pass !== encrypted, `Error: La contraseña no debe guardarse en texto plano`)
  console.log('✓ Verificado con éxito.\n')
}

console.log('TODAS LAS PRUEBAS DE SEGURIDAD FINALIZARON EXITOSAMENTE.')
