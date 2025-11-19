const scanner = require('sonarqube-scanner').default;

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: process.env.SONAR_TOKEN || '',
    options: {
      'sonar.organization': 'fegisucepto',
      'sonar.projectKey': 'fegisucepto_belajar-nodejs-dasar',
      'sonar.projectName': 'belajar-nodejs-dasar',
      'sonar.sources': '.',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.exclusions': 'node_modules/**,**/*.test.js,**/*.spec.js,coverage/**,dist/**,**/__tests__/**,**/test/**',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.scm.disabled': 'true',
      'sonar.qualitygate.wait': 'true',
      'sonar.analysis.ci': 'true'
    }
  },
  (result) => {
    console.log('SonarQube analysis finished');
    process.exit(0);
  }
).catch(err => {
  console.error('Error during SonarQube analysis:', err);
  process.exit(1);
});