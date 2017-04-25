/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

module webSocketGauge.parts
{
    import RectangularProgressBar = webSocketGauge.lib.graphics.RectangularProgressBar;
    
    export class DigiTachoPanel extends PIXI.Container
    {
        private tachoProgressBar: RectangularProgressBar;

        private speedLabel: PIXI.Text;
        private geasposLabel: PIXI.Text;

        private speed : number = 0;
        private tacho : number = 0;
        private gearPos : string = "N";

        static get RequestedTexturePath() : string[]
        {
            return ["/parts/DigiTachoPanel/DigiTachoTexture.json"];
        }

        static get RequestedFontFamily() : string[]
        {
            return ["FreeSans-Bold", "AudioWide"]
        }

        static get RequestedFontCSSURL() : string[]
        {
            return ['/parts/fonts/font.css'];
        }

        private speedLabelTextStyle = new PIXI.TextStyle(
        {
            dropShadow : true,
            dropShadowBlur: 10,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill : "white",
            fontFamily: "FreeSans-Bold",
            fontSize: 155,
            align:"right",
            letterSpacing: -3
        });

        private gearPosLabelTextStyle = new PIXI.TextStyle(
        {
            dropShadow : true,
            dropShadowBlur: 10,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill : "white",
            fontFamily: "AudioWide",
            fontSize: 100,
            align:"center"
        });

        get Speed() : number { return this.speed;}
        set Speed(speed : number)
        {
            this.speed = speed;
            const roundedSpeed : number = Math.round(speed);
            this.speedLabel.text = roundedSpeed.toString();
        }

        get Tacho(): number {return this.tacho}
        set Tacho(tacho : number)
        {
            this.tacho = tacho;
            this.tachoProgressBar.Value = tacho;
            this.tachoProgressBar.update();
        }

        constructor()
        {
            super();
            this.create();
        }

        private create() : void
        {
            const backTexture = PIXI.Texture.fromFrame("DigiTachoBack");
            const tachoProgressBarTexture = PIXI.Texture.fromFrame("DigiTachoBar");

            //Create background sprite
            const backSprite = new PIXI.Sprite();
            backSprite.texture = backTexture;
            super.addChild(backSprite);

            //Create tacho progress bar
            const tachoProgressBar = new RectangularProgressBar();
            this.tachoProgressBar = tachoProgressBar;
            tachoProgressBar.Texture = tachoProgressBarTexture;
            tachoProgressBar.position.set(10,6);
            tachoProgressBar.Min = 0;
            tachoProgressBar.Max = 9000;
            tachoProgressBar.Vertical = false;
            tachoProgressBar.InvertDirection = false;
            tachoProgressBar.InvertDraw = false;
            tachoProgressBar.PixelStep = 16;
            tachoProgressBar.MaskHeight = 246;
            tachoProgressBar.MaskWidth = 577;
            super.addChild(tachoProgressBar);

            const speedTextLabel = new PIXI.Text(this.speed.toString());
            this.speedLabel = speedTextLabel;
            speedTextLabel.style = this.speedLabelTextStyle
            speedTextLabel.position.set(485,320);
            speedTextLabel.anchor.set(1,1);
            super.addChild(speedTextLabel);

            const gearTextLabel = new PIXI.Text(this.gearPos);
            this.geasposLabel = gearTextLabel;
            gearTextLabel.style = this.gearPosLabelTextStyle;
            gearTextLabel.position.set(64, 55);
            gearTextLabel.anchor.set(0.5, 0.5);
            super.addChild(gearTextLabel);
        }
    }
}