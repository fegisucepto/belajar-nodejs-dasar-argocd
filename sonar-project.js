const scanner = require('sonarqube-scanner').default;

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    options: {
      'sonar.organization': 'fegisucepto',
      'sonar.projectKey': 'fegisucepto_belajar-nodejs-dasar',
      'sonar.projectName': 'belajar-nodejs-dasar',
      'sonar.sources': '.',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.exclusions': 'node_modules/**,**/*.test.js,**/*.spec.js,coverage/**,dist/**,**/__tests__/**,**/test/**',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'test-report.xml',
      'sonar.scm.disabled': 'true',  // Nonaktifkan SCM jika tidak diperlukan
      'sonar.scm.provider': 'git',    // Atau 'svn' jika menggunakan SVN
      'sonar.scm.exclusions.disabled': 'true'  // Nonaktifkan pengecualian SCM
    },
  },
  () => process.exit()
);