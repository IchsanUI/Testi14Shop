/**
 * Format a number as Indonesian Rupiah currency
 * @param value - The number to format (number or string)
 * @returns Formatted Rupiah string (e.g., "Rp 100.000")
 */
export function formatRupiah(value: number | string | bigint): string {
  const numValue = typeof value === 'bigint' ? Number(value) : Number(value)

  if (isNaN(numValue)) {
    return 'Rp 0'
  }

  return `Rp ${numValue.toLocaleString('id-ID')}`
}

/**
 * Format a number as Indonesian Rupiah with optional zero display
 * @param value - The number to format
 * @param showZero - Whether to show "Rp 0" or "-" for zero values
 * @returns Formatted Rupiah string
 */
export function formatRupiahWithZero(
  value: number | string | bigint,
  showZero: boolean = false
): string {
  const numValue = typeof value === 'bigint' ? Number(value) : Number(value)

  if (numValue === 0 && !showZero) {
    return '-'
  }

  return formatRupiah(numValue)
}

/**
 * Format discount value based on type
 * @param value - The discount value
 * @param valueType - Either "percentage" or "fixed"
 * @returns Formatted discount string (e.g., "20%" or "Rp 50.000")
 */
export function formatDiscount(
  value: number | string | bigint,
  valueType: 'percentage' | 'fixed' = 'percentage'
): string {
  const numValue = typeof value === 'bigint' ? Number(value) : Number(value)

  if (valueType === 'fixed') {
    return formatRupiah(numValue)
  }

  return `${numValue}%`
}
