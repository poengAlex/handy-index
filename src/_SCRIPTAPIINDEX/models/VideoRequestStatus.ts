/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum VideoRequestStatus {
    /**
     * The request is pending verification.
     */
    PENDING_VERIFICATION = 'pending.verification',
    /**
     * The request is pending metadata collection.
     */
    PENDING_METADATA = 'pending.metadata',
    /**
     * The request have been approved and registered. Published and can receive votes.
     */
    REGISTERED = 'registered',
    /**
     * The request have been accepted for scripting.
     */
    ACCEPTED = 'accepted',
    /**
     * The video request video have been downloaded.
     */
    DOWNLOADED = 'downloaded',
    /**
     * The request have been rejected.
     */
    REJECTED = 'rejected',
    /**
     * The requested video have been scripted and published.
     */
    PUBLISHED = 'published',
    /**
     * The request video is pending download.
     */
    PENDING_DOWNLOAD = 'pending.download',
}
