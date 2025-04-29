import { calculate } from '@chainsafe/fast-crc32c';

export function checksum(value: Uint8Array): Uint8Array {
  const x = calculate(value);
  const result = new Uint8Array(4);

  // As defined in section 3 of https://github.com/google/snappy/blob/master/framing_format.txt
  // And other implementations for reference:
  // Go: https://github.com/golang/snappy/blob/2e65f85255dbc3072edf28d6b5b8efc472979f5a/snappy.go#L97
  // Python: https://github.com/andrix/python-snappy/blob/602e9c10d743f71bef0bac5e4c4dffa17340d7b3/snappy/snappy.py#L70
  // Mask the right hand to (32 - 17) = 15 bits -> 0x7fff, to keep correct 32 bit values.
  // Shift the left hand with >>> for correct 32 bit intermediate result.
  // Then final >>> 0 for 32 bits output
  const masked = ((((x >>> 15) | ((x & 0x7fff) << 17)) + 0xa282ead8)) >>> 0;
  
  // Write the 32-bit value in little-endian format
  result[0] = masked & 0xff;
  result[1] = (masked >> 8) & 0xff;
  result[2] = (masked >> 16) & 0xff;
  result[3] = (masked >> 24) & 0xff;

  return result;
} 