export class Photo {
  constructor(public orientation: 'H' | 'V', public tags: Set<string>) {}
}
