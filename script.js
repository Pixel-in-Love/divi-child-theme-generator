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

  // Generate style.css
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

  // Generate functions.php
  const functionsPhp = `
  <?php
    function child_enqueue_styles() {
      wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
      wp_enqueue_script('custom-js', get_stylesheet_directory_uri() . '/custom.js', array(), '1.0.0', true);
    }
    add_action('wp_enqueue_scripts', 'child_enqueue_styles');
    
  ?>`;

  // Create a new JSZip instance
  const zip = new JSZip();

  // Add files to the zip
  zip.file("style.css", styleCss);
  zip.file("functions.php", functionsPhp);
  zip.file("custom.js", customJS);

  var response = await fetch('screenshot.png');  // Assuming 'default.png' is the name of the default PNG file
  var defaultImageBlob = await response.blob();
  zip.file('screenshot.png', defaultImageBlob);

  // Generate the zip file
  zip.generateAsync({type:"blob"}).then(function(content) {
      // Create a URL for the zip file
      const url = URL.createObjectURL(content);

      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'divi-child-theme.zip';
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
  });
});
