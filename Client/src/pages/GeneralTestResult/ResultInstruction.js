import React, { useState } from "react";
import logo from "../../assets/images/High5Logo.png";
import Loader from "../../components/loader/Loader";

const ResultInstruction = ({ setInstruction, loading }) => {
  const [checked, setChecked] = useState(true);
  return (
    <>
      {loading && <Loader />}
      <div
        className="d-flex p-2 shadow p-3 border-bottom justify-content-between"
        style={{
          backgroundColor: "#fff",
          height: "10vh",
          minHeight: 65,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
        }}
      >
        <img src={logo} alt="logo" />
        {/* <div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            type="button"
          >
            Copy
          </button>
        </div> */}
      </div>

      <div
        style={{
          width: "100vw",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="overflow-auto rounded-3 p-4 mb-4 mt-5"
        // className="d-flex justify-content-center align-item-center"
      >
        <div className="container-fluid">
          <div className="row position-relative">
            <div className="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
              <div className="card card-xl">
                <div className="card-body">
                  <div className="Sspace"></div>
                  <h4 className="font-bold mb-3">
                    Standard Marketplace Terms:
                  </h4>
                  <div className="Sspace"></div>
                  <p>
                    THESE MARKETPLACE TERMS (the “Terms”) are agreed to between
                    High5 LLC, a New Jersey limited liability company with a
                    principal office located at 285 Davidson Avenue Suite 406
                    Somerset, NJ 08873-4153 (“High5”), the search firm or other
                    workforce solutions provider (the “Search Firm”) who will
                    provide candidates for contingent & permanent placement
                    positions to hiring companies as part of the Marketplace
                    (defined below), and the hiring company receiving such
                    services from the Search Firm (the “Company”)(collectively
                    the “Parties”).
                  </p>
                  <p>
                    WHEREAS, High5 is in the business of providing a hosted
                    software platform (the “High5”) to engage with and manage
                    search firms providing candidates for hiring companies’
                    contingent & permanent placement hires; and
                  </p>
                  <p>
                    WHEREAS, Search Firm desires access to and use of the High5
                    and to provide Search Services (defined below) to
                    prospective employers (each, a “Company”), as described in
                    more detail herein; and
                  </p>
                  <p>
                    WHEREAS, Company desires to receive the Search Services from
                    Search Firm under the terms and conditions herein.
                  </p>
                  <p>
                    NOW THEREFORE, in consideration of the mutual covenants and
                    agreements contained herein, and other good and valuable
                    consideration, the receipt and sufficiency of which is
                    hereby acknowledged, the Parties agree as follows:
                  </p>
                  1.Definitions <br />
                  <div className="Sspace"></div>
                  <p>
                    1.1 “Acceptance” shall mean acceptance of a Candidate in the
                    High5 for consideration to fill an open permanent or
                    contract hire position for Company.
                  </p>
                  <p>
                    1.2 “Applicant Tracking System (ATS)” shall mean an
                    applicant tracking system utilized by the Company.
                  </p>
                  <p>
                    1.3 “Candidate” shall mean an individual submitted by Search
                    Firm through the High5 to be considered for permanent /
                    contract hire by Company.
                  </p>
                  <p>
                    1.4 “Company Agreement” shall mean the agreement entered
                    into between High5 and Company for High5’s provision of
                    administrative, management and support services related to
                    the High5 Program.
                  </p>
                  <p>
                    1.5 “Marketplace” shall mean the aggregate collection of
                    search firms that have agreed to these Terms and to submit
                    candidates to High5 hiring companies through the High5. Upon
                    acceptance of these Terms and agreement to any other
                    requirements provided by High5, Search Firm will become
                    enrolled in the Marketplace.
                  </p>
                  <p>
                    1.6 “Placement Fee” shall mean the fee agreed to between
                    High5 and Search Firm in the High5 for the direct hiring or
                    contract by Company of a Candidate submitted by Search Firm,
                    and usually expressed as a designated flat fee as
                    appropriate for each placement.
                  </p>
                  <p>
                    1.7 “Requisition” shall mean an open contingent
                    permanent/contract placement job posting by Company,
                    including any job requirements or other specified terms.
                  </p>
                  <p>
                    1.8 “High5 Program” shall mean the program managed and
                    administered by High5 through the High5 and implemented for
                    Company under a Company Agreement, which among other things
                    involves the engagement and management of search firms
                    through the High5.
                  </p>
                  <p>
                    1.9 “Search Services” shall mean those services provided by
                    Search Firm in providing Candidates for open Requisitions
                    that are managed through the High5 Program.
                  </p>
                  <p>
                    1.10 “Terms of Use” shall mean those terms and conditions
                    agreed to with High5 by Search Firm regarding access to and
                    use of the High5.
                  </p>
                  2. High5 Program <br />
                  <div className="Sspace"></div>
                  2.1 Service Provider understands that when Company has chosen
                  High5 to administer and manage the High5 Program, and Company
                  and High5 have entered into a Company Agreement to govern the
                  terms of High5’s services thereunder, Company will submit
                  electronic Requisitions to be distributed to the Marketplace
                  through the High5, which is hosted and maintained by High5 and
                  may be integrated with Company’s ATS.
                  <p />
                  2.2 Search Firm shall become a member of the Marketplace and
                  commence participation in the High5 Program by accepting these
                  Terms and corresponding Terms of Use electronically through
                  the High5, and providing all required documentation referenced
                  in these Terms or required by High5 in writing.
                  <p />
                  2.3 Service Provider understands that Company will require
                  search firms to participate in the High5 Program in order to
                  fill Requisitions from Company for jobs that are posted in the
                  High5, and Search Firm shall be required to provide any
                  contingent permanent/contract placement services to Company
                  through the High5 if the particular job is posted in the
                  High5.
                  <p />
                  2.4 In the event Search Firm has an existing services
                  agreement with Company for the provision of the same type of
                  services to be provided under these Terms, these Terms will
                  supersede and replace such services agreement with respect to
                  the provision of Search Services to Company under the High5
                  Program.
                  <p />
                  2.5 Except as expressly permitted elsewhere in these Terms,
                  Search Firm shall direct all communications related to
                  Candidates, Placement Fees, contract terms, or any other
                  inquiry to High5 and shall not have any communication directly
                  with Company related to the High5 Program unless authorized by
                  High5. The foregoing limitation does not prohibit
                  communication initiated by Company or job- related
                  communications specific to an Accepted Candidate.
                  <p />
                  2.6 Search Firm may not re-post any Company- specific
                  Requisition information to an external job board. A Candidate
                  application to an external job board posting will not, by
                  itself, qualify as a valid consent to representation as
                  required in Section 3.3 below.
                  <p />
                  3. Placement and Candidate Ownership
                  <br />
                  <div className="Sspace"></div>
                  <p>
                    3.1 Search Firms will view Requisitions and submit qualified
                    Candidates to Company through the High5. A “Placement”
                    occurs and a Placement Fee is due when a Search Firm’s
                    Candidate (i) is submitted by Search Firm for an open
                    Requisition; (ii) is “Accepted” in form of “Approval” by
                    Candidate in the High5; (iii) is offered and accepts a
                    position with Company; and (iv) begins his/her first day of
                    employment with Company within 180 days of Acceptance.
                  </p>
                  <p>
                    3.2 Candidate Ownership Between Search Firms. If two or more
                    search firms submit the same Candidate, the search firm
                    whose Candidate was Accepted “in form of Approval” first
                    shall be deemed to have made the Placement; provided that in
                    the case of an ownership dispute, such search firm (i) can
                    provide documentation of the Candidate’s consent to
                    representation and (ii) engaged in substantive documented
                    hiring activity with Company with respect to that Candidate
                    after Acceptance. In the event of an ownership dispute where
                    two or more search firms submit the same Candidate to
                    different Requisitions, the hiring activity required in
                    subsection (ii) above must be substantially related to the
                    Candidate's ultimate hire. In the event of a dispute among
                    search firms regarding which firm is entitled to any fee,
                    High5 shall in its sole discretion determine the fee, if
                    any, applicable to each such firm.
                  </p>
                  <p>
                    3.3 Candidate Ownership Between Company and Search Firm. A
                    Candidate shall be deemed to be sourced by Company and not
                    the Search Firm, and no Placement Fee will be due, if all of
                    the following criteria are satisfied: (i) the Candidate
                    existed in Company’s database or Company otherwise had
                    actual knowledge of the Candidate prior to that Candidate’s
                    Acceptance in the High5; (ii) Search Firm did not engage in
                    any substantive documented hiring activity with Company with
                    respect to that Candidate after the Candidate’s Acceptance;
                    (iii) Company has engaged in recruiting activity with that
                    Candidate in the previous 12 months; and (iv) Company
                    notifies High5 and provides supporting documentation of the
                    known Candidate prior to the Candidate’s first day of
                    employment with Company.
                  </p>
                  <p>
                    4. Guarantee Period. A ninety (90) day guarantee period is
                    provided on all Placements made though the High5, unless a
                    different guarantee period is selected by Company in the
                    High5 for the applicable Requisition (“Guarantee Period”).
                    If Company hires a Candidate and that Candidate does not
                    remain employed by Company for the duration of the Guarantee
                    Period for any reason other than a job elimination,
                    downsizing, or layoff initiated by Company, no Placement Fee
                    will be due. Company is responsible for notifying High5 that
                    a Candidate is no longer employed with Company, the reason
                    for the termination, and that they wish to exercise this
                    guarantee. Such notification should be provided as soon as
                    possible but in any event must be received by High5 no later
                    than 5 days after the end of the Guarantee Period. If High5
                    does not receive such notification, the Guarantee Period has
                    been satisfied and no refund of the Placement Fee will be
                    due regardless of the Candidate’s employment status. If such
                    notification is received within the required notice period,
                    any Placement Fee already paid by Company will be refunded
                    to Company within 30 days of such notification.
                  </p>
                  5. Invoicing and Payment Terms
                  <br />
                  <div className="Sspace"></div>
                  <p>
                    5.1 High5 shall be responsible for invoicing Company for all
                    Fees. As soon as reasonably possible following Candidate’s
                    acceptance of an offer, Company shall notify High5 of the
                    hire and Search Firm shall provide High5 timely and accurate
                    Candidate Placement data sufficient for High5 to submit an
                    invoice to Company. High5 will invoice Company for Placement
                    Fees owed and any sales, use, excise or similar tax due
                    under these Terms.
                  </p>
                  <p>
                    5.2 In no event may payments due for Placements be made
                    directly to Search Firm (“Misdirected Payment”). Search Firm
                    is expressly prohibited from directing a Company to pay
                    Search Firm or collect any Placement Fees directly. In
                    the event Search Firm receives a Misdirected Payment, Search
                    Firm agrees not to deposit, cash or otherwise utilize the
                    funds and to remit the full Misdirected Payment to High5 as
                    soon as practicable. If High5 does not receive a Misdirected
                    Payment within 15 calendar days of receipt by Search Firm,
                    Search Firm will pay to High5 a fee of ten percent (10%) of
                    the Misdirected Payment as a late penalty.
                  </p>
                  5.3 High5 shall pay Search Firm the Placement Fee, less any
                  applicable taxes and as detailed below, within the later of
                  ninety (90) days from the Candidate’s first day of employment
                  with Company or ten (10) days from the expiration of the
                  Guarantee Period. The standard Guarantee Period is 90 days.
                  <p />
                  5.4 Search Firm acknowledges and agrees that High5 has no
                  obligation to pay Search Firm for any Placement Fee or other
                  invoiced amount unless and until Company pays that part of the
                  invoice issued on behalf of Search Firm.
                  <p />
                  5.5 High5 shall have the right to offset against amounts that
                  may be due to Search Firm against amounts due High5 that have
                  not been paid in accordance with these Terms. Invoicing and
                  payment disputes between the Parties shall be resolved by
                  High5. Such disputes may be settled for less than the full
                  Placement Fee set or agreed upon in the High5.
                  <p />
                  5.6 High5 will invoice for and Company is expected to pay to
                  High5 any sales, use, excise, or similar tax due on payments
                  made under these Terms. High5 will remit any such taxes
                  received from Company to the appropriate taxing authority.
                  <p />
                  6. Confidential Information and Non-Circumvention
                  <br />
                  <div className="Sspace"></div>
                  6.1 By reason of the relationship hereunder, the Parties will
                  have access to certain information and materials concerning
                  the other that are confidential and of substantial value,
                  which value would be impaired if such information were
                  disclosed to third parties (“Confidential Information” as
                  further defined below).
                  <p />
                  6.2 Confidential Information shall include, without
                  limitation, the features and functions of the High5 that are
                  not available to the general public (including screen shots of
                  the same and future enhancements), performance and security
                  test results related to the High5 Service, financial
                  information provided by Search Firm, content supplied by
                  Company including Requisitions, the commercial terms of this
                  Agreement (but not the mere existence of this Agreement),
                  information regarding a Candidate and any other material
                  specifically designated as confidential.
                  <p />
                  6.3 The Parties agree that they will not, and their employees,
                  agents and contractors will not, make use of, disseminate,
                  post outside of the High5 or in any way disclose any
                  Confidential Information of the other Party to any person,
                  firm or business, except to (i) High5 users who need to know
                  such information in order to make use of the High5 and who are
                  bound by materially as restrictive obligations as those
                  contained herein or (ii) for any purpose the disclosing party
                  may hereafter authorize in writing. Each Party agrees that it
                  will treat all Confidential Information with the same degree
                  of care as it accords to its own Confidential Information, and
                  each Party represents that it exercises reasonable care to
                  protect its own Confidential Information.
                  <p />
                  6.4 Notwithstanding the foregoing, “Confidential Information”
                  shall not include: (i) information previously known to the
                  receiving Party without reference to Confidential Information,
                  (ii) information which is or becomes publicly known through no
                  act or omission of the receiving Party, (iii) information
                  which has been independently developed by the receiving Party
                  without reference to the disclosing Party’s Confidential
                  Information, (iv) information received from a third party
                  under no confidentiality obligation with respect to the
                  Confidential Information, (v) information required to be
                  disclosed pursuant to administrative or court order,
                  government or regulatory requirement or arbitration or
                  litigation arising out of this Agreement.
                  <p />
                  6.5 Search Firm agrees that it will not in any way attempt to
                  circumvent, or to circumvent, High5 by transacting or
                  consummating any business or transaction with Company,
                  directly or indirectly.
                  <p />
                  6.6 Expiration or termination of these Terms shall not relieve
                  any Party of its obligations regarding Confidential
                  Information.
                  <p />
                  7. Indemnification
                  <br />
                  <div className="Sspace"></div>
                  7.1 Search Firm will indemnify, defend and hold harmless High5
                  and Company, along with their parents, subsidiaries,
                  affiliates, directors, officers, agents, employees and
                  investors, from and against any and all claims, demands,
                  losses, liabilities, damages and expenses (including
                  reasonable attorneys’ fees)(collectively “Claims”) arising
                  from: (i) the acts or omissions of Search Firm; and (ii) the
                  breach of these Terms or the Terms of Use by Search Firm. The
                  above indemnification obligations will not apply to any act or
                  omission taken at Company’s or High5’s explicit direction.
                  <p />
                  7.2 High5 will indemnify, defend and hold harmless Search
                  Firm, along with its parent, subsidiaries, affiliates,
                  directors, officers, agents and employees, from and against
                  any and all Claims arising from: (i) the negligent, fraudulent
                  or wrongful acts and omissions of High5 or its officers,
                  employees or authorized agents; or (ii) High5’s material
                  breach of these Terms or the Terms of Use.
                  <p />
                  8. Limitation of Liability
                  <br />
                  <div className="Sspace"></div>
                  8.1 NO PARTY SHALL BE LIABLE FOR OR REQUIRED TO INDEMNIFY
                  ANOTHER PARTY FOR ANY INCIDENTAL, CONSEQUENTIAL, SPECIAL OR
                  PUNITIVE DAMAGES, INCLUDING LOST PROFIT, REGARDLESS OF HOW
                  CHARACTERIZED AND EVEN IF THE RELEVANT PARTY HAS BEEN ADVISED
                  OF THE POSSIBILITY OF SUCH DAMAGES, WHICH ARISE FROM THE
                  PERFORMANCE UNDER THESE TERMS OR IN CONNECTION WITH THESE
                  TERMS, AND REGARDLESS OF THE FORM OF ACTION, WHETHER IN
                  CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE.
                  <p />
                  8.2 EXCEPT WITH RESPECT TO SEARCH FIRM’S CONFIDENTIALITY
                  OBLIGATIONS OR A BREACH BY SEARCH FIRM OF THE TERMS OF USE,
                  LIABILITY UNDER THESE TERMS, REGARDLESS OF THE FORM OF ACTION,
                  WILL NOT EXCEED (i) WITH RESPECT TO LIABILITY BETWEEN HIGH5
                  AND SEARCH FIRM, THE FEES RETAINED BY THE LIABLE PARTY IN THE
                  12 MONTHS PRIOR TO THE ACT GIVING RISE TO THE LIABILITY.
                  <p />
                  9. Audit
                  <br />
                  <div className="Sspace"></div>
                  Search Firm shall maintain complete and accurate records of
                  information and data related to its Search Services and other
                  obligations hereunder, and to support the fees charged to
                  Company in accordance with these Terms for a period of three
                  (3) years after the fees or expenses were charged. Upon
                  reasonable notice to Search Firm and no more frequently than
                  once per calendar year for High5 and Company
                  <p />
                  separately, High5 and Company representatives shall be
                  entitled to audit Search Firm’s records with respect to the
                  Search Services, obligations under these Terms and the Terms
                  of Use, and the determination of charges due pursuant to these
                  Terms. Any such audit shall be conducted during regular
                  business hours at Search Firm’s offices. High5’s and Company’s
                  audit rights shall terminate one (1) year following
                  termination of these Terms. High5 and Company shall be
                  responsible for their own costs incurred in conducting the
                  audit unless such audit results document that Search Firm was
                  engaged in grossly negligent or fraudulent practices.
                  <p />
                  10. Non-Solicitation
                  <br />
                  <div className="Sspace"></div>
                  Search Firm will not solicit for hire, hire, or assist others
                  with the opportunity to do the same any employees of Company
                  during the term of these Terms and for twelve (12) months
                  thereafter. Notwithstanding the foregoing, this provision does
                  not apply if a Company employee initiates contact with Search
                  Firm, or to solicitation or hiring which is a result of
                  general advertisements, career fair, job board postings or
                  other notices for employment not directly targeted to such
                  Company employee.
                  <p />
                  11. Warranties
                  <br />
                  <div className="Sspace"></div>
                  a) Search Firm is responsible for complying with all stated
                  requirements of a Requisition, verifying Candidate
                  information, ensuring the Candidate’s authorization to work in
                  the applicable jurisdiction(s), ensuring that the Candidate
                  has consented to submitting Candidate information to Company
                  and High5, and ensuring Search Firm has all necessary rights
                  to provide the Candidate information for incorporation and use
                  as needed for the High5 Program.
                  <p />
                  b) Company is solely responsible for its own representations
                  made in its Requisitions, and will be solely responsible to
                  represent and warrant that it is an Equal Opportunity Employer
                  and will comply with all applicable laws with respect to
                  Candidate interviewing and hiring decisions.
                  <p />
                  c) Search Firm agrees to submit all Candidates without regard
                  to race, color, national origin, religion, sex, age, sexual
                  orientation, gender identity, disability, covered veteran
                  status, or any other characteristic protected by law,
                  including but not limited to consideration of criminal or
                  credit history as required by applicable law.
                  <p />
                  d) Search Firm agrees to comply with all applicable laws of
                  any applicable foreign or domestic jurisdiction, and in the
                  event the United States is an applicable jurisdiction all
                  applicable state, federal, and local laws, including but not
                  limited to Executive Order 11246, Section 503 of the
                  Rehabilitation Act of 1973, as amended, the Vietnam Era
                  Veterans' Readjustment Assistance Act of 1974, as amended, and
                  the implementing regulations for each found at 41 CFR Part 60,
                  as well as the Department of Labor, Office of Federal Contract
                  Compliance programs regulations at 41 CFR Part 60-1, which
                  relate to the definition of Internet Applicants and all
                  related record keeping requirements, as well as other relevant
                  local regulations. In addition, Company and Staffing Firm will
                  incorporate these Terms, as applicable, the Equal Opportunity
                  clauses found at 41 CFR § 60-1.4(a), 60-250.5(a), 60-741.5(a),
                  and 60- 300.5(a), and will likewise ensure that such laws and
                  regulations are followed by subcontractors as required by 41
                  CFR § 60-1.4(d).
                  <p />
                  e) Search Firm and Company will use the High5 in compliance
                  with all export control laws.
                  <p />
                  f) The Parties acknowledge and agree that any acceptance of
                  terms (including electronic acceptance through the High5) and
                  conditions related to the High5 Program, including but not
                  limited to these Marketplace Terms and the Terms of Use, shall
                  be accepted only by a duly authorized representative of the
                  Party who is authorized to bind that Party on all matters
                  related to the document(s) being accepted.
                  <p />
                  12. Term and Termination
                  <br />
                  <div className="Sspace"></div>
                  12.1 These Terms shall begin as of the date a duly authorized
                  representative of Search Firm first accepts these Terms in the
                  High5 and shall continue until terminated in accordance with
                  the terms herein. High5 and Company may terminate these Terms
                  at any time for convenience upon at least thirty (30) days
                  prior written notice to the other Parties. High5 further
                  reserves the right to suspend or terminate immediately any
                  user account or activity that is disrupting or causing harm to
                  High5’s computers, systems, infrastructure, Marketplace, or in
                  violation of federal, state, or other applicable law.
                  <p />
                  12.2 Search Firm may terminate these Terms at any time for
                  convenience upon at least thirty (30) days prior written
                  notice to High5 and Company.
                  <p />
                  12.3 Notwithstanding any other provision of these Terms, any
                  Party may terminate these Terms immediately in the event
                  another Party declares or becomes bankrupt or insolvent, or
                  dissolves or discontinues operations.
                  <p />
                  12.4 Upon termination of these Terms for any reason, all
                  rights granted hereunder shall immediately terminate and
                  Search Firm will cease to be able to use or have access to the
                  High5. High5 may, in its sole discretion, anonymize from the
                  High5 any files or other information or data relating to
                  Search Firm’s High5 account.
                  <p />
                  12.5 Survival. Each provision of these Terms reasonably
                  intended by its terms to survive termination or expiration of
                  these Terms shall so survive. Notwithstanding the foregoing,
                  in the event of termination of these Terms by any Party, the
                  provisions of these Terms will continue to apply to any
                  Candidate that has been submitted by Search Firm through the
                  High5 as of the termination date.
                  <p />
                  13. General <br />
                  <div className="Sspace"></div>
                  13.1 Publicity. Search Firm shall not identify High5 or
                  Company in any marketing materials without prior written
                  permission of High5 or Company, as the case may be.
                  <p />
                  13.2 Term Modifications. High5 may make changes to these
                  Marketplace Terms and/or the Terms of Use in its sole
                  discretion for the benefit of all users of the High5 without
                  notice. Such changes shall be deemed effective upon posting
                  the modified Marketplace Terms or Terms of Use, as applicable,
                  to the High5. Company and Search Firm acknowledge and agree
                  that their continued use of the High5 after such posting shall
                  constitute acceptance of the modified terms.
                  <p />
                  13.3 Subcontracting. Search Firm may not subcontract the
                  Search Services or any of its obligations hereunder without
                  the prior written consent of High5.
                  <p />
                  13.4 Assignment. Search Firm may not assign these Terms or its
                  rights and obligations hereunder without the prior written
                  consent of High5.
                  <p />
                  13.5 Force Majeure. The Parties shall not be considered in
                  breach of these Terms for their failure to perform or their
                  delay in the performance of any obligation hereunder if the
                  performance of such obligation is prevented or delayed by
                  fire, flood, explosion, war, insurrection, embargo,
                  governmental actions or requirements, military authority, act
                  of God, shortages in the marketplace or any other event beyond
                  the reasonable control of that Party. The Parties agree to
                  take prompt reasonable actions to minimize the effects of any
                  such event or circumstances.
                  <p />
                  13.6 Choice of Law, Venue, and Construction. These Terms will
                  be governed by and construed in accordance with the laws of
                  the State of New Jersey without regard to conflict of law
                  rules of any jurisdiction. Any disputes related to these
                  Marketplace Terms or Terms of Use shall be resolved solely in
                  the New Jersey Superior Court located in Middlesex County, New
                  Jersey or in the applicable federal court vicinage located in
                  the District of New Jersey. Search Firm hereby consents to the
                  exclusive jurisdiction and venue of such court(s) for all
                  matters arising hereunder. If Search Firm accesses the High5
                  from outside of the United States, directly or indirectly, it
                  does so at its own risk and is responsible for compliance with
                  the laws of that jurisdiction. The relationship of the Parties
                  hereunder is that of independent contractors, and these Terms
                  will not be construed to imply that any Party is the agent,
                  employee, or joint venture of the other. In the event that any
                  provision of these Terms is held to be unenforceable, these
                  Terms will continue in full force and effect without said
                  provision and will be interpreted to reflect the original
                  intent of the parties.
                  <p />
                  13.7 Entire Agreement. These Terms, as supplemented by the
                  Terms of Use, supersede and cancel all previous agreements or
                  past practices among the Parties and constitutes the entire
                  agreement among the Parties with respect thereto. Except as
                  provided in Section 13.2, any amendment or agreement
                  supplemental hereto shall not be binding unless executed, in
                  writing, by the Parties thereto.
                  <p />
                </div>

                <div className="d-flex">
                  <div className="form-check mb-4 ms-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={(e) => setChecked(!checked)}
                      style={{ width: 20 }}
                    />
                  </div>
                  <span className="mt-1 ms-2">
                    By selecting this box, I agree that I have read, understood,
                    and consented to the "Standard Marketplace Terms and
                    Conditions" and "Privacy policy.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-4"
          onClick={() => {
            setInstruction(false);
          }}
          disabled={checked}
        >
          See Result
        </button>
      </div>
    </>
  );
};

export default ResultInstruction;
