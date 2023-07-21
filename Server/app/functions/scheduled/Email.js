const Header = `<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <title>Mozilla</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }

        img {
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a img {
            border: none;
        }

        #backgroundTable {
            margin: 0;
            padding: 0;
            width: 100% !important;
        }

        a,
        a:link {
            color: #2A5DB0;
            text-decoration: underline;
        }

        table td {
            border-collapse: collapse;
        }

        span {
            color: inherit;
            border-bottom: none;
        }

        span:hover {
            background-color: transparent;
        }
    </style>

    <style>
        .scalable-image img {
            max-width: 100% !important;
            height: auto !important
        }

        .button a {
            transition: background-color .25s, border-color .25s
        }



        @media only screen and (max-width: 400px) {
            .preheader {
                font-size: 12px !important;
                text-align: center !important
            }

            .header--white {
                text-align: center
            }

            .header--white .header__logo {
                display: block;
                margin: 0 auto;
                width: 118px !important;
                height: auto !important
            }

            .header--left .header__logo {
                display: block;
                width: 118px !important;
                height: auto !important
            }
        }

        @media screen and (-webkit-device-pixel-ratio),
        screen and (-moz-device-pixel-ratio) {

            .sub-story__image,
            .sub-story__content {
                display: block !important
            }

            .sub-story__image {
                float: left !important;
                width: 200px
            }

            .sub-story__content {
                margin-top: 30px !important;
                margin-left: 200px !important
            }
        }

        @media only screen and (max-width: 550px) {
            .sub-story__inner {
                padding-left: 30px !important
            }

            .sub-story__image,
            .sub-story__content {
                margin: 0 auto !important;
                float: none !important;
                text-align: center
            }

            .sub-story .button {
                padding-left: 0 !important
            }
        }

        @media only screen and (max-width: 400px) {

            .featured-story--top table,
            .featured-story--top td {
                text-align: left
            }

            .featured-story--top__heading td,
            .sub-story__heading td {
                font-size: 18px !important
            }

            .featured-story--bottom:nth-child(2) .featured-story--bottom__inner {
                padding-top: 10px !important
            }

            .featured-story--bottom__inner {
                padding-top: 20px !important
            }

            .featured-story--bottom__heading td {
                font-size: 28px !important;
                line-height: 32px !important
            }

            .featured-story__copy td,
            .sub-story__copy td {
                font-size: 14px !important;
                line-height: 20px !important
            }

            .sub-story table,
            .sub-story td {
                text-align: center
            }

            .sub-story__hero img {
                width: 100px !important;
                margin: 0 auto
            }
        }

        @media only screen and (max-width: 400px) {
            .footer td {
                font-size: 12px !important;
                line-height: 16px !important
            }
        }

        @media screen and (max-width:600px) {
            table[class="columns"] {
                margin: 0 auto !important;
                float: none !important;
                padding: 10px 0 !important;
            }

            td[class="left"] {
                padding: 0px 0 !important;
    </style>

</head>`;
const Body = `<body style="background: #e1e1e1;font-family:Arial, Helvetica, sans-serif; font-size:1em;">
<style type="text/css">
    div.preheader {
        display: none !important;
    }
</style>
<table id="backgroundTable" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#e1e1e1;">
    <tr>
        <td class="body" align="center" valign="top" style="background:#e1e1e1;" width="100%">
            <table cellpadding="0" cellspacing="0">
                <tr>
                    <td width="640">
                    </td>
                </tr>
                <tr>
                    <td class="main" width="640" align="center" style="padding: 0 10px;">
                        <table style="min-width: 100%; " class="stylingblock-content-wrapper" width="100%"
                            cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="stylingblock-content-wrapper camarker-inner">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td width="640" align="left">
                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td class="header header--left" style="padding: 20px 10px;"
                                                            align="left">
                                                            <a href="https://high5hire.com"><img
                                                                    class="header__logo"
                                                                    src="http://cdn.mcauto-images-production.sendgrid.net/95fd13153fcc4fa0/4c5b87fd-f905-4130-8404-3c303397a08b/247x112.png"
                                                                    alt="High5Hire"
                                                                    style="display: block; border: 0;" width="158"
                                                                    height="59"></a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="min-width: 100%; " class="stylingblock-content-wrapper" width="100%"
                            cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="stylingblock-content-wrapper camarker-inner">
                                    <table class="featured-story featured-story--top" cellspacing="0"
                                        cellpadding="0">
                                        <tr>
                                            <td style="padding-bottom: 20px;">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td class="featured-story__inner" style="background: #fff;">
                                                            <table cellspacing="0" cellpadding="0">

                                                                <tr>
                                                                    <td class="featured-story__content-inner"
                                                                        style="padding: 5px 21px 36px;">
                                                                        <table cellspacing="0" cellpadding="0">

                                                                            <tr>
                                                                                <td class="featured-story__copy"
                                                                                    style="background: #fff;"
                                                                                    width="640" align="center">
                                                                                    <table cellspacing="0"
                                                                                        cellpadding="0">
                                                                                        <tr>
                                                                                            <td style="font-family: Geneva, Tahoma, Verdana, sans-serif; font-size: 16px; line-height: 22px; color: #555555; padding-top: 16px;"
                                                                                                align="left">

                                                                            `;
const Footer = `                                                                       </div>
<div></div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</table>
<!--[if mso]>
</td>
</tr>
</table>
</center>
<![endif]-->
</td>
</tr>
</table>  </td>
</tr>
</table>
</td>
</tr>
<tr>
<td class="button"
style="font-family: Geneva, Tahoma, Verdana, sans-serif; font-size: 16px; padding-top: 26px;"
width="640" align="left">

</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td class="footer" width="640" align="center" style="padding-top: 10px;">
<table cellspacing="0" cellpadding="0">
<tr>
<td align="center"
style="font-family: Geneva, Tahoma, Verdana, sans-serif; font-size: 14px; line-height: 18px; color: #738597; padding: 0 20px 40px;">
<br> <br>

<br>
<a href="https://high5hire.com" target="_blank"><img
src="http://cdn.mcauto-images-production.sendgrid.net/95fd13153fcc4fa0/4c5b87fd-f905-4130-8404-3c303397a08b/247x112.png"
alt="Mozilla" style="display: block; border: 0;" width="100"></a>
<br>
<strong><a href="https://high5hire.com" style="color: #0c99d5;"
target="_blank">Go to High5Hire Website</a></strong>
&nbsp;&nbsp;
<br><br>


285 Davidson Avenue Suite 406 Somerset, NJ 08873-4153
<br>

</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>

<!-- Exact Target tracking code -->


</custom>
</body>

</html>`;

module.exports = {
  Header,
  Body,
  Footer,
};
