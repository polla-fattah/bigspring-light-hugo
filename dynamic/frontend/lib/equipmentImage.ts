export function getEquipmentImageUrl(
  image: string | null | undefined, 
  name: string = '', 
  description?: string | null
): string {
  if (image && image.trim() !== '' && image !== 'null' && image !== 'undefined') {
    return image.startsWith('/') || image.startsWith('http') ? image : `/${image}`;
  }

  const text = `${name} ${description}`.toLowerCase();

  // 1. Microscope & Imaging Systems
  if (
    text.includes('microscope') ||
    text.includes('microscopic') ||
    text.includes('binocular') ||
    text.includes('compound') ||
    text.includes('dissecting') ||
    text.includes('transilluminator') ||
    text.includes('inverted') ||
    text.includes('zeiss') ||
    text.includes('camera')
  ) {
    return '/images/equipment/microscope.svg';
  }

  // 2. Spectrophotometer & Optical Instruments
  if (
    text.includes('spectro') ||
    text.includes('spectrophotometer') ||
    text.includes('spectrometer') ||
    text.includes('photometer') ||
    text.includes('refractometer') ||
    text.includes('polarimeter') ||
    text.includes('colorimeter') ||
    text.includes('nanodrop')
  ) {
    return '/images/equipment/spectrophotometer.svg';
  }

  // 3. Centrifuge
  if (
    text.includes('centrifug') || 
    text.includes('rotor') || 
    text.includes('angle head') || 
    text.includes('hematocrit')
  ) {
    return '/images/equipment/centrifuge.svg';
  }

  // 4. Autoclave & Sterilizer
  if (
    text.includes('autoclave') || 
    text.includes('steriliz') || 
    text.includes('steam')
  ) {
    return '/images/equipment/autoclave.svg';
  }

  // 5. PCR & Thermal Cycler
  if (
    text.includes('pcr') ||
    text.includes('thermal cycler') ||
    text.includes('qpcr') ||
    text.includes('sequencer') ||
    text.includes('electrophor')
  ) {
    return '/images/equipment/pcr-cycler.svg';
  }

  // 6. Incubator
  if (
    text.includes('incubat') || 
    text.includes('shaker incubator') || 
    text.includes('growth chamber') || 
    text.includes('germinat')
  ) {
    return '/images/equipment/incubator.svg';
  }

  // 7. Balance & Scale
  if (
    text.includes('balance') || 
    text.includes('scale') || 
    text.includes('weighing') || 
    text.includes('mass')
  ) {
    return '/images/equipment/analytical-balance.svg';
  }

  // 8. Water Bath & Block Heater
  if (
    text.includes('water bath') ||
    text.includes('dri-block') ||
    text.includes('heating mantle') ||
    text.includes('hotplate') ||
    text.includes('stirrer') ||
    text.includes('heater')
  ) {
    return '/images/equipment/water-bath.svg';
  }

  // 9. Oven & Muffle Furnace
  if (
    text.includes('oven') || 
    text.includes('furnace') || 
    text.includes('incinerat')
  ) {
    return '/images/equipment/muffle-oven.svg';
  }

  // 10. Biosafety Cabinet & Laminar Flow
  if (
    text.includes('biosafety') ||
    text.includes('laminar') ||
    text.includes('fume hood') ||
    text.includes('clean bench') ||
    text.includes('cabinet')
  ) {
    return '/images/equipment/biosafety-cabinet.svg';
  }

  // 11. Distillation & Water Purification
  if (
    text.includes('distil') ||
    text.includes('water purif') ||
    text.includes('still') ||
    text.includes('evaporator') ||
    text.includes('rotary') ||
    text.includes('ro system')
  ) {
    return '/images/equipment/distillation-unit.svg';
  }

  // 12. HPLC & Chromatography
  if (
    text.includes('hplc') || 
    text.includes('chromatograph') || 
    text.includes('mass spec') || 
    text.includes('column')
  ) {
    return '/images/equipment/hplc-chromatography.svg';
  }

  // 13. Deep Freezer & Refrigerator
  if (
    text.includes('freezer') || 
    text.includes('refrigerat') || 
    text.includes('fridge') || 
    text.includes('cryo')
  ) {
    return '/images/equipment/deep-freezer.svg';
  }

  // 14. Electrical Meters & Sensors
  if (
    text.includes('meter') ||
    text.includes('ph') ||
    text.includes('conductivity') ||
    text.includes('voltmeter') ||
    text.includes('ammeter') ||
    text.includes('avometer') ||
    text.includes('tds') ||
    text.includes('sensor') ||
    text.includes('viscos')
  ) {
    return '/images/equipment/measurement-meter.svg';
  }

  // 15. Vacuum Pump, Shaker & Homogenizer
  if (
    text.includes('pump') ||
    text.includes('shaker') ||
    text.includes('vortex') ||
    text.includes('homoginizer') ||
    text.includes('homogenizer') ||
    text.includes('blender') ||
    text.includes('sonicator') ||
    text.includes('mixer')
  ) {
    return '/images/equipment/pump-shaker.svg';
  }

  // 16. Engineering Rig & Aerodynamics
  if (
    text.includes('wind tunnel') ||
    text.includes('aerodynamic') ||
    text.includes('engine') ||
    text.includes('strain') ||
    text.includes('testing') ||
    text.includes('trainer') ||
    text.includes('hydraulic')
  ) {
    return '/images/equipment/engineering-rig.svg';
  }

  return '/images/equipment/default-equipment.svg';
}
