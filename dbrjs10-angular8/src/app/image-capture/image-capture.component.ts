import { Component, ViewChild, ElementRef } from '@angular/core';
import '../dynamsoft.config';
const { EnumCapturedResultItemType } = (self as any).Dynamsoft.Core;
const { CaptureVisionRouter } = (self as any).Dynamsoft.CVR;

@Component({
  selector: 'app-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.css'],
})
export class ImageCaptureComponent {
  @ViewChild('results', {static:true}) resultsContainer?: ElementRef<HTMLDivElement>;

  pCvRouter?: Promise<any>;
  isDestroyed = false;

  captureImage = async (e: Event) => {
    let files = [...((e.target! as HTMLInputElement).files as any as File[])];
    (e.target! as HTMLInputElement).value = ''; // reset input
    this.resultsContainer!.nativeElement.innerText = '';
    try {
      // ensure cvRouter is created only once
      const cvRouter = await (this.pCvRouter =
        this.pCvRouter || CaptureVisionRouter.createInstance());
      if (this.isDestroyed) return;

      for (let file of files) {
        // Decode selected image with 'ReadBarcodes_SpeedFirst' template.
        const result = await cvRouter.capture(file, 'ReadBarcodes_SpeedFirst');
        if (this.isDestroyed) return;

        // Print file name if there's multiple files
        if (files.length > 1) {
          this.resultsContainer!.nativeElement.innerText += `\n${file.name}:\n`;
        }
        for (let _item of result.items) {
          if (_item.type !== EnumCapturedResultItemType.CRIT_BARCODE) {
            continue; // check if captured result item is a barcode
          }
          let item = _item;
          this.resultsContainer!.nativeElement.innerText += item.text + '\n'; // output the decoded barcode text
          console.log(item.text);
        }
        // If no items are found, display that no barcode was detected
        if (!result.items.length)
          this.resultsContainer!.nativeElement.innerText +=
            'No barcode found\n';
      }
    } catch (ex) {
      let errMsg = ex.message || ex;
      console.error(errMsg);
      alert(errMsg);
    }
  };

  // dispose cvRouter when it's no longer needed
  async ngOnDestroy() {
    this.isDestroyed = true;
    if (this.pCvRouter) {
      try {
        (await this.pCvRouter).dispose();
      } catch (_) {}
    }
  }
}
