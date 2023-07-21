import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
// import { getUserRole } from "./services/AuthServices";
// import { Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/App.css";
import "./assets/css/custom.css";
import { ProtectedRoute } from "./services/ProtectedRoute";
import AuthRedirect from "./pages/auth/AuthRedirect";

const Login = React.lazy(() => import("./pages/auth/Login"));
const Users = React.lazy(() => import("./pages/Users/Users"));
const Results = React.lazy(() => import("./pages/result/Result"));
const Candidate = React.lazy(() => import("./pages/Candidate/Candidate"));
const Project = React.lazy(() => import("./pages/project/Project"));
const ProjectAssessment = React.lazy(() =>
  import("./pages/project/ProjectAssessment")
);
// const ProjectResults = React.lazy(() =>
//   import("./pages/project/ProjectResults")
// );
const Assessments = React.lazy(() => import("./pages/Assessments/Assessments"));
const AssessmentResult = React.lazy(() =>
  import("./pages/GeneralTestResult/GeneralTestResult")
);
const DashBoard = React.lazy(() => import("./pages/dashboard/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const CreateAssessment = React.lazy(() =>
  import("./pages/Assessments/CreateAssessment/CreateAssessment")
);
const AssessmentsIndex = React.lazy(() =>
  import("./pages/Assessments/AssessmentsIndex")
);
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const CreatePassword = React.lazy(() => import("./pages/auth/CreatePassword"));
const QuestionLibrary = React.lazy(() =>
  import("./pages/questionLibrary/QuestionLibrary")
);
const GeneralTestReview = React.lazy(() => import("./pages/Reviewer/Review"));
const ChatGPT = React.lazy(() => import("./components/chatGPT/ChatGPT"));
const NotificationCentre = React.lazy(() =>
  import("./pages/notificationCentre/NotificationCentre")
);

function App() {
  return (
    <div className="App">
      <Suspense>
        <ToastContainer position="top-center" autoClose={"5000"} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chatGpt" element={<ChatGPT />} />

            <Route
              path="/dashboard"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["admin", "companyAdmin", "member"]}>
                    <DashBoard />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route
              path="/profile"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["admin", "companyAdmin", "member"]}>
                    <Profile />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route
              path="/users"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["admin", "companyAdmin"]}>
                    <Users />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route
              path="/projects"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["companyAdmin", "member"]}>
                    <Project />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route
              path="/project/assessments"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["companyAdmin", "member"]}>
                    <ProjectAssessment />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            {/* <Route path="/project/results" element={<ProjectResults />} /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/questionLibrary"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["admin", "companyAdmin", "member"]}>
                    <QuestionLibrary />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route path="/createPassword/:id" element={<CreatePassword />} />

            <Route path="/candidate" element={<Candidate />} />

            <Route
              path="/results"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["companyAdmin", "member"]}>
                    <Results />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route
              path="/notificationCentre"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["admin"]}>
                    <NotificationCentre />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            />

            <Route
              path="/reviewer/:candidateId/"
              element={<GeneralTestReview />}
            />

            <Route path="/result/:candidateId" element={<AssessmentResult />} />

            <Route
              path="/assessments"
              element={
                <AuthRedirect>
                  <ProtectedRoute roles={["admin", "companyAdmin", "member"]}>
                    <AssessmentsIndex />
                  </ProtectedRoute>
                </AuthRedirect>
              }
            >
              <Route
                path=""
                element={
                  <AuthRedirect>
                    <Assessments />
                  </AuthRedirect>
                }
              ></Route>
              <Route
                path="create"
                element={
                  <AuthRedirect>
                    <CreateAssessment />
                  </AuthRedirect>
                }
              ></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
