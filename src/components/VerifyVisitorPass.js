import { useState, useEffect } from 'react';
import { Client, Functions } from 'appwrite';
import './VerifyVisitorPass.css';

function VerifyVisitorPass() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [manualId, setManualId] = useState('');
  const [isManualVerification, setIsManualVerification] = useState(false);

  useEffect(() => {
    const client = new Client();
    client
      .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
      .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

    const functions = new Functions(client);
    const query = new URLSearchParams(window.location.search);
    const passId = query.get('id');

    if (!passId && !isManualVerification) {
      setResult('Missing pass ID in the URL or manually entered ID.');
      setLoading(false);
      return;
    }

    const idToVerify = isManualVerification ? manualId : passId;

    functions
      .createExecution(process.env.REACT_APP_APPWRITE_FUNCTION_ID_VERIFY_PASS, JSON.stringify({ id: idToVerify }))
      .then((response) => {
        let responseBody = response.responseBody;

        try {
          responseBody = JSON.parse(responseBody);
          setResult(responseBody.message || 'Visitor pass verified successfully');
        } catch (error) {
          setResult(responseBody);
        }

        setLoading(false);
      })
      .catch((error) => {
        setResult(`Error: ${error.message}`);
        setLoading(false);
      });
  }, [manualId, isManualVerification]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualId.trim() !== '') {
      setIsManualVerification(true);
      setLoading(true);
      setResult(''); // Reset result to show loading indicator
    }
  };

  return (
    <div>
    <div className="verify-pass-container">
      <div className="verify-pass-content">
        <h2 className="verify-pass-title">Verify Visitor Pass</h2>

        {loading ? (
          <p className="loading-message">Loading, please wait...</p>
        ) : (
          <p className={`result-message ${result.includes('Error') ? 'error' : 'success'}`}>{result}</p>
        )}

        {!isManualVerification && !loading && result && !result.includes('verified successfully') && (
          <div className="auto-verification-info">
            <h3>Auto Verification Status</h3>
            <p>Pass ID from URL: {new URLSearchParams(window.location.search).get('id')}</p>
          </div>
        )}

        <div className="manual-verification-section">
          <h3>Manual Verification</h3>
          <p>If you have a pass ID, enter it below to manually verify.</p>
          <form onSubmit={handleManualSubmit} className="manual-verification-form">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter Pass ID"
              className="pass-id-input"
              required
            />
            <button type="submit" className="verify-button">
              Verify
            </button>
          </form>
        </div>
      </div>

      
    </div>
    <footer className="verify-pass-footer">
        <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default VerifyVisitorPass;
