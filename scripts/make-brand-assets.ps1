#requires -Version 5.1
<#
  Gera os assets de marca da Bari a partir da logo oficial (dourada sobre rosa).

  - Remove o fundo rosa por distância de cor (alpha suave, sem fringe).
  - Recolore em dourado / bronze / marfim (variantes de uso).
  - Exporta o lockup completo e o wordmark (sem "CAFFE") para o header.
  - Gera favicon e apple-touch-icon com o disco rosa da marca.

  Uso: powershell -ExecutionPolicy Bypass -File scripts/make-brand-assets.ps1
#>

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "public\demo\bari\raw\logo-bari.jpg"
$outDir = Join-Path $root "public\brand"
$appDir = Join-Path $root "app"

if (-not (Test-Path -LiteralPath $src)) { throw "Logo não encontrada: $src" }
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$code = @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class BrandTool
{
    public static string Run(string srcPath, string outDir, string appDir)
    {
        var log = new System.Text.StringBuilder();
        using (var bmp = new Bitmap(srcPath))
        {
            int w = bmp.Width, h = bmp.Height;
            var rect = new Rectangle(0, 0, w, h);
            var data = bmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int stride = data.Stride;
            byte[] buf = new byte[stride * h];
            Marshal.Copy(data.Scan0, buf, 0, buf.Length);
            bmp.UnlockBits(data);

            // Fundo: média dos 4 cantos
            long sr = 0, sg = 0, sb = 0; int n = 0; int box = Math.Min(28, Math.Min(w, h) / 8);
            int[] xs = { 0, w - box };
            int[] ys = { 0, h - box };
            foreach (int by in ys)
                foreach (int bx in xs)
                    for (int y = by; y < by + box; y++)
                        for (int x = bx; x < bx + box; x++)
                        {
                            int i = y * stride + x * 4;
                            sb += buf[i]; sg += buf[i + 1]; sr += buf[i + 2]; n++;
                        }
            double br = (double)sr / n, bg = (double)sg / n, bb = (double)sb / n;
            log.AppendLine("bg = " + (int)br + "," + (int)bg + "," + (int)bb);

            // Alpha por distância de cor (rampa suave 26..95)
            byte[] alpha = new byte[w * h];
            int minX = w, minY = h, maxX = -1, maxY = -1;
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++)
                {
                    int i = y * stride + x * 4;
                    double dr = buf[i + 2] - br, dg = buf[i + 1] - bg, db = buf[i] - bb;
                    double d = Math.Sqrt(dr * dr + dg * dg + db * db);
                    double t = (d - 26.0) / (95.0 - 26.0);
                    if (t < 0) t = 0; if (t > 1) t = 1;
                    byte av = (byte)(t * 255);
                    alpha[y * w + x] = av;
                    if (av > 24) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
                }

            log.AppendLine("bbox = " + minX + "," + minY + " " + maxX + "," + maxY);

            // Perfil de linhas: bandas com conteúdo (para separar wordmark de CAFFE)
            var bands = new System.Collections.Generic.List<int[]>();
            bool inBand = false; int bandStart = 0;
            for (int y = 0; y < h; y++)
            {
                bool row = false;
                for (int x = minX; x <= maxX; x++) if (alpha[y * w + x] > 24) { row = true; break; }
                if (row && !inBand) { inBand = true; bandStart = y; }
                if (!row && inBand) { inBand = false; bands.Add(new int[] { bandStart, y - 1 }); }
            }
            if (inBand) bands.Add(new int[] { bandStart, h - 1 });
            foreach (var b in bands) log.AppendLine("band " + b[0] + ".." + b[1] + " h=" + (b[1] - b[0] + 1));

            int pad = 10;
            int cx0 = Math.Max(0, minX - pad), cy0 = Math.Max(0, minY - pad);
            int cx1 = Math.Min(w - 1, maxX + pad), cy1 = Math.Min(h - 1, maxY + pad);
            int cw = cx1 - cx0 + 1, ch = cy1 - cy0 + 1;

            // Corte do wordmark: fim da 1ª banda (BARI + swash), antes do "CAFFE"
            int wordBottom = cy1;
            if (bands.Count >= 2) wordBottom = Math.Min(cy1, bands[0][1] + pad);
            int wh = wordBottom - cy0 + 1;

            Save(alpha, w, stride, cx0, cy0, cw, ch, Color.FromArgb(201, 154, 46), System.IO.Path.Combine(outDir, "bari-logo-gold.png"));
            Save(alpha, w, stride, cx0, cy0, cw, ch, Color.FromArgb(138, 100, 21), System.IO.Path.Combine(outDir, "bari-logo-bronze.png"));
            Save(alpha, w, stride, cx0, cy0, cw, ch, Color.FromArgb(251, 246, 238), System.IO.Path.Combine(outDir, "bari-logo-ivory.png"));
            Save(alpha, w, stride, cx0, cy0, cw, wh, Color.FromArgb(201, 154, 46), System.IO.Path.Combine(outDir, "bari-wordmark-gold.png"));
            Save(alpha, w, stride, cx0, cy0, cw, wh, Color.FromArgb(138, 100, 21), System.IO.Path.Combine(outDir, "bari-wordmark-bronze.png"));
            Save(alpha, w, stride, cx0, cy0, cw, wh, Color.FromArgb(251, 246, 238), System.IO.Path.Combine(outDir, "bari-wordmark-ivory.png"));

            log.AppendLine("lockup = " + cw + "x" + ch + " ratio=" + Math.Round((double)cw / ch, 3));
            log.AppendLine("wordmark = " + cw + "x" + wh + " ratio=" + Math.Round((double)cw / wh, 3));

            // Favicon: disco rosa da marca + wordmark dourado
            MakeIcon(alpha, w, stride, cx0, cy0, cw, wh, Color.FromArgb(255, 205, 214), 512, System.IO.Path.Combine(appDir, "icon.png"));
            MakeIcon(alpha, w, stride, cx0, cy0, cw, wh, Color.FromArgb(255, 205, 214), 180, System.IO.Path.Combine(appDir, "apple-icon.png"));
        }
        return log.ToString();
    }

    static void Save(byte[] alpha, int w, int stride, int x0, int y0, int cw, int ch, Color color, string path)
    {
        using (var outBmp = new Bitmap(cw, ch, PixelFormat.Format32bppArgb))
        {
            var r = new Rectangle(0, 0, cw, ch);
            var d = outBmp.LockBits(r, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            byte[] o = new byte[d.Stride * ch];
            for (int y = 0; y < ch; y++)
                for (int x = 0; x < cw; x++)
                {
                    byte av = alpha[(y0 + y) * w + (x0 + x)];
                    int i = y * d.Stride + x * 4;
                    // Premultiplica para evitar halo em downscale do browser
                    double f = av / 255.0;
                    o[i + 3] = av;
                    o[i + 2] = (byte)Math.Round(color.R * f);
                    o[i + 1] = (byte)Math.Round(color.G * f);
                    o[i + 0] = (byte)Math.Round(color.B * f);
                }
            Marshal.Copy(o, 0, d.Scan0, o.Length);
            outBmp.UnlockBits(d);
            outBmp.Save(path, ImageFormat.Png);
        }
    }

    static void MakeIcon(byte[] alpha, int w, int stride, int x0, int y0, int cw, int wh, Color bg, int size, string path)
    {
        using (var bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
        using (var g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(bg);

            // Wordmark em 74% da largura, centrado
            double targetW = size * 0.84;
            double scale = targetW / cw;
            int dw = (int)Math.Round(cw * scale), dh = (int)Math.Round(wh * scale);
            int dx = (size - dw) / 2, dy = (size - dh) / 2;

            using (var layer = new Bitmap(dw, dh, PixelFormat.Format32bppArgb))
            {
                var r = new Rectangle(0, 0, dw, dh);
                var d = layer.LockBits(r, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                byte[] o = new byte[d.Stride * dh];
                for (int y = 0; y < dh; y++)
                    for (int x = 0; x < dw; x++)
                    {
                        int sx = x0 + (int)(x / scale);
                        int sy = y0 + (int)(y / scale);
                        if (sx > x0 + cw - 1) sx = x0 + cw - 1;
                        if (sy > y0 + wh - 1) sy = y0 + wh - 1;
                        byte av = alpha[sy * w + sx];
                        int i = y * d.Stride + x * 4;
                        double f = av / 255.0;
                        o[i + 3] = av;
                        o[i + 2] = (byte)Math.Round(201 * f);
                        o[i + 1] = (byte)Math.Round(154 * f);
                        o[i + 0] = (byte)Math.Round(46 * f);
                    }
                Marshal.Copy(o, 0, d.Scan0, o.Length);
                layer.UnlockBits(d);
                g.DrawImage(layer, dx, dy, dw, dh);
            }
            bmp.Save(path, ImageFormat.Png);
        }
    }
}
'@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$result = [BrandTool]::Run($src, $outDir, $appDir)
Write-Output $result
Write-Output "--- arquivos ---"
Get-ChildItem -LiteralPath $outDir -File | Select-Object Name, Length | Format-Table -AutoSize
Get-ChildItem -LiteralPath $appDir -Filter "*-icon.png" -File | Select-Object Name, Length | Format-Table -AutoSize

