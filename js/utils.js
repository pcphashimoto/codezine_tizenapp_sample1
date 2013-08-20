function getOrientation(imgDataURL){
        var byteString = atob(imgDataURL.split(',')[1]);
        var orientaion = byteStringToOrientation(byteString);
        return orientaion;

        function byteStringToOrientation(img){
            var head = 0;
            var orientation;
            while (1){
                if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 218) {break;}
                if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 216) {
                    head += 2;
                }
                else {
                    var length = img.charCodeAt(head + 2) * 256 + img.charCodeAt(head + 3);
                    var endPoint = head + length + 2;
                    if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 225) {
                        var segment = img.slice(head, endPoint);
                        var bigEndian = segment.charCodeAt(10) == 77;
                        if (bigEndian) {
                            var count = segment.charCodeAt(18) * 256 + segment.charCodeAt(19);
                        } else {
                            var count = segment.charCodeAt(18) + segment.charCodeAt(19) * 256;
                        }
                        for (i=0;i<count;i++){
                            var field = segment.slice(20 + 12 * i, 32 + 12 * i);
                            if ((bigEndian && field.charCodeAt(1) == 18) || (!bigEndian && field.charCodeAt(0) == 18)) {
                                orientation = bigEndian ? field.charCodeAt(9) : field.charCodeAt(8);
                            }
                        }
                        break;
                    }
                    head = endPoint;
                }
                if (head > img.length){break;}
            }
            return orientation;
        }
    }