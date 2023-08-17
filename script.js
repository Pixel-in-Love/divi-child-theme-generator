const themeForm = document.getElementById('divi-child-theme-generator');

themeForm.addEventListener('submit',async function(event) {
  event.preventDefault();

  const themeName = this['theme-name'].value;
  const themeWebsite = this['theme-website'].value;
  const themeDescription = this['theme-description'].value;
  const themeAuthor = this['theme-author'].value;
  const themeAuthorWebsite = this['theme-author-website'].value;
  const themeVersion = this['theme-version'].value;
  const themeLicense = this['theme-license'].value;
  const themeLicenseUrl = this['theme-license-url'].value;
  const themeCustomCSS = this['theme-custom-css'].value;
  const themeCustomJS = this['theme-custom-js'].value;

  const styleCss = `
  /*
  Theme Name:   ${themeName}
  Theme URI:    ${themeWebsite}
  Description:  ${themeDescription}
  Author:       ${themeAuthor}
  Author URI:   ${themeAuthorWebsite}
  Template:     Divi
  Version:      ${themeVersion}
  License:      ${themeLicense}
  License URI:  ${themeLicenseUrl}
  */

  /********* CSS PERSONALIZADO *********/
  ${themeCustomCSS}
  `;

  const customJS = `
  // JAVASCRIPT PERSONALIZADO
  ${themeCustomJS}
  `;

  const functionsPhp = `
  <?php
    function child_enqueue_styles() {
      wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
      wp_enqueue_script('custom-js', get_stylesheet_directory_uri() . '/custom.js', array(), '1.0.0', true);
    }
    add_action('wp_enqueue_scripts', 'child_enqueue_styles');
    
  ?>`;

  const zip = new JSZip();

  zip.file("style.css", styleCss);
  zip.file("functions.php", functionsPhp);
  zip.file("custom.js", customJS);

  const response = await fetch('generator-screenshot.png'); 
  const defaultImageBlob = await response.blob();
  zip.file('screenshot.png', defaultImageBlob);

  zip.generateAsync({type:"blob"}).then(function(content) {
      const url = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'divi-child-theme.zip';
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
  });

  this.reset();
  const successMsg = document.getElementById('successMsg');
  successMsg.classList.add('show-message');

  setTimeout(function() {
      successMsg.classList.remove('show-message');
  }, 5000);
});
