//Initialize function
var init = function() {
	// TODO:: Do your initialization job
	console.log("init() called");

	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName == "back")
			tizen.application.getCurrentApplication().exit();
	});

	/**
	 * カメラ画像ファイル取得のコールバック
	 */
	$("#imageInput").change(function(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = onReadImage;
		if (file.type.match('image.*')) {
			reader.readAsDataURL(file);
		}
	});
	/**
	 * ボタンを押すとINPUTエレメントを反応させる
	 */
	$("#startCamera").click(function() {
		$("#imageInput").click();
	});

	/**
	 * カメラ画像のイメージデータをDataURLの形式で取得した時のコールバック
	 * 
	 * @param e
	 */
	function onReadImage(e) {
		var imageSrc = e.target.result;

		/**
		 * Case1. カメラから取得した画像を表示するのみ
		 */
		$("#inputImage").attr("src", imageSrc);

		/**
		 * Case2. 画像をCanvasを利用して縮小、回転し、文字を載せて貼り付ける
		 */

		// Exif情報からOrientationを取得
		var orientation = getOrientation(imageSrc) || 1;
		console.log(orientation)

		// 一時的なIMAGEエレメントを作成し、一時的なCANVASで画像処理をしてIMGを出力する
		var onLoadImageElement = function(e) {
			var imgEl = e.target;
			
			// 画像の本来の解像度を取得
			var w = imgEl.naturalWidth;
			var h = imgEl.naturalHeight;

			// canvasの解像度を指定
			var canvasWidth = 400;
			var canvasHeight = 400;
			var canvas = $("<canvas>").attr({
				width : canvasWidth,
				height : canvasHeight
			})

			// canvasの描画コンテキストを取得
			var context = canvas[0].getContext('2d');
			// これから変更する回転状態を一旦保存
			context.save();

			switch (orientation) {
			case 3:
				// 180 rotate left
				context.translate(canvasWidth, canvasHeight);
				context.rotate(Math.PI);
				break;
			case 6:
				// 90 rotate right
				context.rotate(0.5 * Math.PI);
				context.translate(0, -canvasHeight);
				break;
			case 8:
				// 90 rotate left
				context.rotate(-0.5 * Math.PI);
				context.translate(-canvasWidth, 0);
				break;
			default:
			}

			// canvasの幅に短辺を合わせて中心に描画する処理
			if (w > h) {
				context.drawImage(imgEl, (w - h) / 2, 0, h, h, 0, 0,
						canvasWidth, canvasHeight)
			} else {
				context.drawImage(imgEl, 0, (h - w) / 2, w, w, 0, 0,
						canvasWidth, canvasHeight)
			}
			// 文字などを上書きするために回転状態を解除する
			context.restore();
			
			// 文字などを張り付けていく
			var caption = "#MyTizenCameraApp";
			context.font = "32px 'Tizen, Helvetica'";
			context.lineWidth = 5;
			context.strokeStyle = "#333333";
			context.strokeText(caption, 30, canvasHeight - 30);	
			context.fillStyle = "#dbd0e6";
			context.fillText(caption, 30, canvasHeight - 30);
			
			//画像を出力する
			$("#inputImage").attr("src", canvas[0].toDataURL("image/png"));
			
			/**
			 * ページ２へ移動
			 */
			$.mobile.changePage("#two");
			
		}
		$("<img>").load(onLoadImageElement).attr("src", imageSrc);		
	}

};
$(document).ready(init);